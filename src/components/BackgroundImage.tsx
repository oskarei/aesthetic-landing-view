
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
  const significantScrollThreshold = 150; // Increased threshold for more stability
  const lastScrollPositionRef = useRef<number>(0);
  const sectionTransitionThreshold = 0.9; // 90% of section must be scrolled before transition

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

  // Check if we're in the gallery or about section based on scroll position
  useEffect(() => {
    const checkVisibleSections = () => {
      // Check for hero section
      const heroSection = document.querySelector('section:first-child');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        // Only consider fully out of hero when it's completely out of view (bottom <= 0)
        const isInHero = heroRect.bottom > 0;
        setIsInHeroSection(isInHero);
      }
      
      // Check for gallery section
      const gallerySection = document.querySelector('[data-gallery-section]');
      if (gallerySection) {
        const galleryRect = gallerySection.getBoundingClientRect();
        // Consider in gallery only when it's fully visible (top < 10% of viewport)
        const isInGallery = galleryRect.top < window.innerHeight * 0.1 && galleryRect.bottom > 0;
        setIsInGallerySection(isInGallery);
      }
      
      // Check for about section
      const aboutSection = document.querySelector('[data-about-section]');
      if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        // Consider in about only when it's fully visible (top < 10% of viewport)
        const isInAbout = aboutRect.top < window.innerHeight * 0.1;
        
        // Only update state when there's a real change (entering or leaving the section)
        if (isInAbout !== isInAboutSection) {
          setIsInAboutSection(isInAbout);
          
          // If entering about section and coming from gallery (not hero), change the background
          if (isInAbout && !isInAboutSection && isInGallerySection && !isInHeroSection) {
            const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
            selectNextBackground(imagesToUse);
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

  // Add scroll event listener to change background on scroll direction change with significant movement
  useEffect(() => {
    const CHANGE_COOLDOWN = 2000; // longer cooldown between background changes in ms
    
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
      
      // Determine scroll direction
      const currentDirection = currentScrollPos < prevScrollPosRef.current ? 'up' : 'down';
      
      // Check if we've transitioned between sections completely
      const heroSection = document.querySelector('section:first-child');
      const gallerySection = document.querySelector('[data-gallery-section]');
      const aboutSection = document.querySelector('[data-about-section]');
      
      let transitioningBetweenSections = false;
      
      if (heroSection && gallerySection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const galleryTop = gallerySection.getBoundingClientRect().top;
        
        // Check if we're transitioning from hero to gallery (hero almost gone, gallery coming in)
        if (currentDirection === 'down' && 
            heroBottom < window.innerHeight * (1 - sectionTransitionThreshold) && 
            galleryTop < window.innerHeight * sectionTransitionThreshold) {
          transitioningBetweenSections = true;
          console.log("Transitioning from hero to gallery");
        }
      }
      
      if (gallerySection && aboutSection) {
        const galleryBottom = gallerySection.getBoundingClientRect().bottom;
        const aboutTop = aboutSection.getBoundingClientRect().top;
        
        // Check if we're transitioning from gallery to about (gallery almost gone, about coming in)
        if (currentDirection === 'down' && 
            galleryBottom < window.innerHeight * (1 - sectionTransitionThreshold) && 
            aboutTop < window.innerHeight * sectionTransitionThreshold) {
          transitioningBetweenSections = true;
          console.log("Transitioning from gallery to about");
        }
      }
      
      // Only update direction state when there's a significant scroll
      if (scrollDistance > significantScrollThreshold) {
        // Update previous scroll position only on significant scrolls
        prevScrollPosRef.current = currentScrollPos;
        
        // If direction changed and we're scrolling with cooldown complete
        // or we're transitioning between sections completely
        if ((isCooldownComplete && 
             ((currentDirection === 'up' && scrollDirection === 'down') || 
              (currentDirection === 'down' && scrollDirection === 'up'))) ||
            (isCooldownComplete && transitioningBetweenSections)) {
          
          const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
          if (imagesToUse.length > 1) {
            selectNextBackground(imagesToUse);
            lastChangeTimeRef.current = currentTime;
            console.log(`Background changed: ${transitioningBetweenSections ? 'section transition' : 'direction change'}, distance: ${scrollDistance}px`);
          }
        }
        
        // Update scroll direction only if there's a significant change
        setScrollDirection(currentDirection);
        lastScrollPositionRef.current = currentScrollPos;
      }
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
