
import { useEffect, useState, useRef } from "react";
import { backgroundImages } from "@/config/portfolioConfig";
import { useHomeContent } from "@/hooks/useHomeContent";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { homeContent, loading } = useHomeContent();
  const [contentBackgroundUrls, setContentBackgroundUrls] = useState<string[]>([]);
  const backgroundIndexRef = useRef<number>(0);
  const lastChangeTimeRef = useRef<number>(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const prevScrollPosRef = useRef<number>(0);
  const [isInGallerySection, setIsInGallerySection] = useState(false);
  const [isInAboutSection, setIsInAboutSection] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const significantScrollThreshold = 200; // Increased threshold for more stability
  const lastScrollPositionRef = useRef<number>(0);
  const sectionTransitionThreshold = 0.95; // 95% of section must be scrolled before transition (increased from 90%)
  const CHANGE_COOLDOWN = 3000; // Increased cooldown between background changes to 3 seconds

  // Get all background URLs from the content
  useEffect(() => {
    if (homeContent?.backgroundConnection?.edges?.length) {
      const urls = homeContent.backgroundConnection.edges.map(edge => edge.node.url);
      setContentBackgroundUrls(urls);
      selectInitialBackground(urls);
    } else if (!loading && backgroundImages.length) {
      // Fallback to config backgrounds if no content backgrounds are available
      selectInitialBackground(backgroundImages);
    }
  }, [homeContent, loading]);

  // Function to select initial background image
  const selectInitialBackground = (images: string[]) => {
    if (images.length > 0) {
      const initialIndex = Math.floor(Math.random() * images.length);
      backgroundIndexRef.current = initialIndex;
      setBackgroundImage(images[initialIndex]);
      console.log("Initial background set to:", images[initialIndex]);
    }
  };

  // Function to select the next background image in sequence
  const selectNextBackground = (images: string[]) => {
    if (images.length > 1) {
      const nextIndex = (backgroundIndexRef.current + 1) % images.length;
      backgroundIndexRef.current = nextIndex;
      const newBackground = images[nextIndex];
      setBackgroundImage(newBackground);
      console.log("Background changed to:", newBackground);
    } else if (images.length === 1) {
      setBackgroundImage(images[0]);
    }
  };

  // Check if we're in the gallery or about section based on scroll position with improved accuracy
  useEffect(() => {
    const checkVisibleSections = () => {
      // Check for hero section - improved detection
      const heroSection = document.querySelector('section:first-child');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        // Only consider out of hero when it's completely out of view (bottom <= 10% of viewport)
        const isInHero = heroRect.bottom > window.innerHeight * 0.1;
        setIsInHeroSection(isInHero);
      }
      
      // Check for gallery section - improved detection
      const gallerySection = document.querySelector('[data-gallery-section]');
      if (gallerySection) {
        const galleryRect = gallerySection.getBoundingClientRect();
        // Consider in gallery only when it's almost fully visible (top < 5% of viewport and bottom still visible)
        const isInGallery = galleryRect.top < window.innerHeight * 0.05 && galleryRect.bottom > 0;
        setIsInGallerySection(isInGallery);
      }
      
      // Check for about section - improved detection
      const aboutSection = document.querySelector('[data-about-section]');
      if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        // Consider in about only when it's almost fully visible (top < 5% of viewport)
        const isInAbout = aboutRect.top < window.innerHeight * 0.05;
        
        // Only update state when there's a real change (entering or leaving the section)
        if (isInAbout !== isInAboutSection) {
          setIsInAboutSection(isInAbout);
          
          // If entering about section from gallery (not hero), change the background
          // but only when we've fully transitioned (not partially scrolled)
          if (isInAbout && !isInAboutSection && isInGallerySection && !isInHeroSection) {
            const currentTime = Date.now();
            // Only change if cooldown has elapsed
            if (currentTime - lastChangeTimeRef.current > CHANGE_COOLDOWN) {
              const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
              selectNextBackground(imagesToUse);
              lastChangeTimeRef.current = currentTime;
            }
          }
        }
      }
    };

    // Check initially
    checkVisibleSections();
    
    // Use passive listener for better performance
    window.addEventListener('scroll', checkVisibleSections, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', checkVisibleSections);
    };
  }, [contentBackgroundUrls, isInAboutSection, isInGallerySection, isInHeroSection]);

  // Handle background changes on significant scroll with improved accuracy and section transitions
  useEffect(() => {
    const handleScroll = () => {
      // Only process if we're in hero or about section
      if (isInGallerySection && !isInHeroSection && !isInAboutSection) {
        return;
      }
      
      const currentScrollPos = window.scrollY;
      const currentTime = Date.now();
      const isCooldownComplete = currentTime - lastChangeTimeRef.current > CHANGE_COOLDOWN;
      
      // Calculate scroll distance
      const scrollDistance = Math.abs(currentScrollPos - lastScrollPositionRef.current);
      
      // Only process significant scrolls
      if (scrollDistance < significantScrollThreshold) {
        return;
      }
      
      // Determine scroll direction
      const currentDirection = currentScrollPos < prevScrollPosRef.current ? 'up' : 'down';
      
      // Check section transitions with improved accuracy
      const heroSection = document.querySelector('section:first-child');
      const gallerySection = document.querySelector('[data-gallery-section]');
      const aboutSection = document.querySelector('[data-about-section]');
      
      let transitioningBetweenSections = false;
      
      if (heroSection && gallerySection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const galleryTop = gallerySection.getBoundingClientRect().top;
        
        // Check if we're transitioning from hero to gallery (hero almost completely gone, gallery coming in)
        if (currentDirection === 'down' && 
            heroBottom < window.innerHeight * (1 - sectionTransitionThreshold) && 
            galleryTop < window.innerHeight * 0.1) {
          transitioningBetweenSections = true;
          console.log("Transitioning from hero to gallery - complete transition");
        }
      }
      
      if (gallerySection && aboutSection) {
        const galleryBottom = gallerySection.getBoundingClientRect().bottom;
        const aboutTop = aboutSection.getBoundingClientRect().top;
        
        // Check if we're transitioning from gallery to about (gallery almost completely gone, about coming in)
        if (currentDirection === 'down' && 
            galleryBottom < window.innerHeight * (1 - sectionTransitionThreshold) && 
            aboutTop < window.innerHeight * 0.1) {
          transitioningBetweenSections = true;
          console.log("Transitioning from gallery to about - complete transition");
        }
      }
      
      // Also check transition from about to gallery when scrolling up
      if (aboutSection && gallerySection) {
        const aboutBottom = aboutSection.getBoundingClientRect().top;
        const galleryBottom = gallerySection.getBoundingClientRect().bottom;
        
        if (currentDirection === 'up' && 
            aboutBottom > window.innerHeight * sectionTransitionThreshold && 
            galleryBottom > window.innerHeight * 0.1) {
          transitioningBetweenSections = true;
          console.log("Transitioning from about to gallery - scrolling up");
        }
      }
      
      // Update previous scroll position on significant scrolls
      prevScrollPosRef.current = currentScrollPos;
      
      // Change background only on complete section transitions or significant direction changes
      if (isCooldownComplete && 
          (transitioningBetweenSections || 
           ((currentDirection === 'up' && scrollDirection === 'down') || 
            (currentDirection === 'down' && scrollDirection === 'up')))) {
        
        const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
        if (imagesToUse.length > 1) {
          selectNextBackground(imagesToUse);
          lastChangeTimeRef.current = currentTime;
          console.log(`Background changed: ${transitioningBetweenSections ? 'section transition complete' : 'direction change'}, distance: ${scrollDistance}px`);
        }
      }
      
      // Update scroll direction only if there's a significant change
      setScrollDirection(currentDirection);
      lastScrollPositionRef.current = currentScrollPos;
    };

    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [contentBackgroundUrls, scrollDirection, isInGallerySection, isInAboutSection, isInHeroSection]); 

  if (!backgroundImage) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-cover bg-center w-full h-full z-0" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0"></div>
    </div>
  );
};

export default BackgroundImage;
