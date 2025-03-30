
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

  // Check if we're in the gallery section based on scroll position
  useEffect(() => {
    const checkIfInGallerySection = () => {
      // Use a combination of scroll position and viewport height to determine
      // if we're in the gallery section
      const gallerySection = document.querySelector('[data-gallery-section]');
      
      if (gallerySection) {
        const rect = gallerySection.getBoundingClientRect();
        // Consider in gallery section when at least 10% of it is visible
        const isInGallery = rect.top < window.innerHeight * 0.9;
        setIsInGallerySection(isInGallery);
        console.log("Is in gallery section:", isInGallery);
      }
    };

    // Check initially
    checkIfInGallerySection();
    
    // Use passive listener for better performance
    window.addEventListener('scroll', checkIfInGallerySection, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', checkIfInGallerySection);
    };
  }, []);

  // Add scroll event listener to change background on scroll direction change
  useEffect(() => {
    const CHANGE_COOLDOWN = 800; // cooldown between background changes in ms
    
    const handleScroll = () => {
      // Only process if we're in the gallery section
      if (!isInGallerySection) {
        return;
      }
      
      const currentScrollPos = window.scrollY;
      const currentTime = Date.now();
      const isCooldownComplete = currentTime - lastChangeTimeRef.current > CHANGE_COOLDOWN;
      
      // Determine scroll direction
      const currentDirection = currentScrollPos < prevScrollPosRef.current ? 'up' : 'down';
      
      // Update previous scroll position
      prevScrollPosRef.current = currentScrollPos;
      
      // If direction changed and we're scrolling up with cooldown complete
      if (currentDirection === 'up' && scrollDirection === 'down' && isCooldownComplete) {
        const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
        if (imagesToUse.length > 1) {
          selectNextBackground(imagesToUse);
          lastChangeTimeRef.current = currentTime;
          console.log("Background changed on scroll direction change to up in gallery section");
        }
      }
      
      // Update scroll direction
      setScrollDirection(currentDirection);
    };

    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    console.log("New scroll event handler attached, gallery-aware");
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [contentBackgroundUrls, scrollDirection, isInGallerySection]); 

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
