
import { useState, useEffect, useRef } from "react";
import { backgroundImages } from "@/config/portfolioConfig";
import { useHomeContent } from "@/hooks/useHomeContent";

export function useBackgroundTransition() {
  const [currentBackgroundUrl, setCurrentBackgroundUrl] = useState<string | null>(null);
  const { homeContent, loading } = useHomeContent();
  const [contentBackgroundUrls, setContentBackgroundUrls] = useState<string[]>([]);
  const backgroundIndexRef = useRef<number>(0);
  const lastChangeTimeRef = useRef<number>(0);
  const [isInGallerySection, setIsInGallerySection] = useState(false);
  const [isInAboutSection, setIsInAboutSection] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const prevScrollPosRef = useRef<number>(0);
  const lastScrollPositionRef = useRef<number>(0);
  
  // Configuration constants for smoother transitions
  const CHANGE_COOLDOWN = 4000; // 4 seconds cooldown between changes
  const SECTION_TRANSITION_THRESHOLD = 0.98; // 98% of section must be scrolled before transition
  const SIGNIFICANT_SCROLL_THRESHOLD = 300; // Higher threshold for more stability

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
      setCurrentBackgroundUrl(images[initialIndex]);
      console.log("Initial background set to:", images[initialIndex]);
    }
  };

  // Function to select the next background image in sequence
  const selectNextBackground = (images: string[]) => {
    if (images.length > 1) {
      const nextIndex = (backgroundIndexRef.current + 1) % images.length;
      backgroundIndexRef.current = nextIndex;
      const newBackground = images[nextIndex];
      setCurrentBackgroundUrl(newBackground);
      console.log("Background changed to:", newBackground);
    } else if (images.length === 1) {
      setCurrentBackgroundUrl(images[0]);
    }
  };

  // Monitor section visibility and handle background transitions
  useEffect(() => {
    const checkSectionVisibility = () => {
      // Check hero section visibility
      const heroSection = document.querySelector('section:first-child');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        // Hero is visible if more than 2% is still in view
        const isInHero = heroRect.bottom > window.innerHeight * 0.02;
        setIsInHeroSection(isInHero);
      }
      
      // Check gallery section visibility
      const gallerySection = document.querySelector('[data-gallery-section]');
      if (gallerySection) {
        const galleryRect = gallerySection.getBoundingClientRect();
        // Consider in gallery when it's almost fully visible and hero is gone
        const isInGallery = 
          galleryRect.top < window.innerHeight * 0.02 && 
          galleryRect.bottom > 0 && 
          (!heroSection || heroSection.getBoundingClientRect().bottom < window.innerHeight * 0.02);
        
        // Only update state when there's a real change
        if (isInGallery !== isInGallerySection) {
          setIsInGallerySection(isInGallery);
        }
      }
      
      // Check about section visibility
      const aboutSection = document.querySelector('[data-about-section]');
      if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        
        // Consider in about only when it's fully visible and gallery is gone
        const isInAbout = 
          aboutRect.top < window.innerHeight * 0.02 &&
          (!gallerySection || gallerySection.getBoundingClientRect().bottom < window.innerHeight * 0.02);
        
        // Only update state when there's a real change
        if (isInAbout !== isInAboutSection) {
          setIsInAboutSection(isInAbout);
          
          // Change background when fully transitioning to about section (not when partially scrolled)
          if (isInAbout && !isInAboutSection && isInGallerySection) {
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
      
      // Handle transitions between sections based on complete section changes
      handleSectionTransition();
    };
    
    const handleSectionTransition = () => {
      const currentScrollPos = window.scrollY;
      const currentTime = Date.now();
      const isCooldownComplete = currentTime - lastChangeTimeRef.current > CHANGE_COOLDOWN;
      
      // Calculate scroll distance since last check
      const scrollDistance = Math.abs(currentScrollPos - lastScrollPositionRef.current);
      
      // Only process significant scrolls and when cooldown is complete
      if (scrollDistance < SIGNIFICANT_SCROLL_THRESHOLD || !isCooldownComplete) {
        return;
      }
      
      // Determine scroll direction
      const scrollingDown = currentScrollPos > prevScrollPosRef.current;
      
      // Check for complete section transitions
      const heroSection = document.querySelector('section:first-child');
      const gallerySection = document.querySelector('[data-gallery-section]');
      const aboutSection = document.querySelector('[data-about-section]');
      
      let completeTransition = false;
      
      if (heroSection && gallerySection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const galleryTop = gallerySection.getBoundingClientRect().top;
        
        // Complete transition from hero to gallery
        if (scrollingDown && 
            heroBottom < window.innerHeight * (1 - SECTION_TRANSITION_THRESHOLD) && 
            galleryTop < window.innerHeight * 0.02) {
          completeTransition = true;
          console.log("Complete transition from hero to gallery");
        }
      }
      
      if (gallerySection && aboutSection) {
        const galleryBottom = gallerySection.getBoundingClientRect().bottom;
        const aboutTop = aboutSection.getBoundingClientRect().top;
        
        // Complete transition from gallery to about
        if (scrollingDown && 
            galleryBottom < window.innerHeight * (1 - SECTION_TRANSITION_THRESHOLD) && 
            aboutTop < window.innerHeight * 0.02) {
          completeTransition = true;
          console.log("Complete transition from gallery to about");
        }
      }
      
      // Complete transition from about to gallery when scrolling up
      if (aboutSection && gallerySection && !scrollingDown) {
        const aboutTop = aboutSection.getBoundingClientRect().top;
        const galleryBottom = gallerySection.getBoundingClientRect().bottom;
        
        if (aboutTop > window.innerHeight * SECTION_TRANSITION_THRESHOLD && 
            galleryBottom > window.innerHeight * 0.2) {
          completeTransition = true;
          console.log("Complete transition from about to gallery (scrolling up)");
        }
      }
      
      // Change background on complete section transitions
      if (completeTransition) {
        const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
        selectNextBackground(imagesToUse);
        lastChangeTimeRef.current = currentTime;
      }
      
      // Update scroll positions
      prevScrollPosRef.current = currentScrollPos;
      lastScrollPositionRef.current = currentScrollPos;
    };

    // Check section visibility initially and on scroll
    checkSectionVisibility();
    window.addEventListener('scroll', checkSectionVisibility, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', checkSectionVisibility);
    };
  }, [contentBackgroundUrls, isInAboutSection, isInGallerySection, isInHeroSection]);

  return {
    currentBackgroundUrl,
    isInHeroSection,
    isInGallerySection,
    isInAboutSection
  };
}
