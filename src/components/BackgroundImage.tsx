
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
        const isInHero = heroRect.bottom > 0;
        setIsInHeroSection(isInHero);
      }
      
      // Check for gallery section
      const gallerySection = document.querySelector('[data-gallery-section]');
      if (gallerySection) {
        const galleryRect = gallerySection.getBoundingClientRect();
        const isInGallery = galleryRect.top < window.innerHeight * 0.5 && galleryRect.bottom > 0;
        setIsInGallerySection(isInGallery);
      }
      
      // Check for about section
      const aboutSection = document.querySelector('[data-about-section]');
      if (aboutSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        const isInAbout = aboutRect.top < window.innerHeight * 0.5;
        setIsInAboutSection(isInAbout);
        
        // If entering about section, change the background
        if (isInAbout && !isInAboutSection) {
          const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
          selectNextBackground(imagesToUse);
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
  }, [contentBackgroundUrls, isInAboutSection]);

  // Add scroll event listener to change background on scroll direction change
  useEffect(() => {
    const CHANGE_COOLDOWN = 800; // cooldown between background changes in ms
    
    const handleScroll = () => {
      // Only process if we're in hero or about section
      if (isInGallerySection && !isInHeroSection && !isInAboutSection) {
        return;
      }
      
      const currentScrollPos = window.scrollY;
      const currentTime = Date.now();
      const isCooldownComplete = currentTime - lastChangeTimeRef.current > CHANGE_COOLDOWN;
      
      // Determine scroll direction
      const currentDirection = currentScrollPos < prevScrollPosRef.current ? 'up' : 'down';
      
      // Update previous scroll position
      prevScrollPosRef.current = currentScrollPos;
      
      // If direction changed and we're scrolling with cooldown complete
      if (isCooldownComplete && (
        (currentDirection === 'up' && scrollDirection === 'down') || 
        (currentDirection === 'down' && scrollDirection === 'up') ||
        (isInAboutSection && !isInGallerySection)
      )) {
        const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
        if (imagesToUse.length > 1) {
          selectNextBackground(imagesToUse);
          lastChangeTimeRef.current = currentTime;
          console.log(`Background changed on scroll direction change to ${currentDirection}`);
        }
      }
      
      // Update scroll direction
      setScrollDirection(currentDirection);
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
