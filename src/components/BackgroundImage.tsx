
import { useEffect, useState, useRef } from "react";
import { backgroundImages } from "@/config/portfolioConfig";
import { useHomeContent } from "@/hooks/useHomeContent";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { homeContent, loading } = useHomeContent();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [contentBackgroundUrls, setContentBackgroundUrls] = useState<string[]>([]);
  const [hasScrolledBelowHero, setHasScrolledBelowHero] = useState(false);
  const changeTimeoutRef = useRef<number | null>(null);
  const lastChangeTimeRef = useRef<number>(0);
  const backgroundIndexRef = useRef<number>(0);

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
      console.log("Initial background set to index:", initialIndex);
    }
  };

  // Function to select the next background image in sequence
  const selectNextBackground = (images: string[]) => {
    if (images.length > 1) {
      // Move to next image in the array
      const nextIndex = (backgroundIndexRef.current + 1) % images.length;
      backgroundIndexRef.current = nextIndex;
      setBackgroundImage(images[nextIndex]);
      console.log("Background changed to index:", nextIndex);
    } else if (images.length === 1) {
      setBackgroundImage(images[0]);
      console.log("Only one background image available");
    }
  };

  // Add scroll event listener to change background only when returning to hero from below
  useEffect(() => {
    const heroSectionHeight = window.innerHeight; // Approximate hero section height
    const CHANGE_COOLDOWN = 1000; // 1 second cooldown between background changes
    
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const currentTime = Date.now();
      
      // Detect if user has scrolled below hero section
      if (currentScrollPos > heroSectionHeight * 0.8) {
        setHasScrolledBelowHero(true);
      }
      
      // Clear any pending timeout to prevent multiple rapid changes
      if (changeTimeoutRef.current) {
        window.clearTimeout(changeTimeoutRef.current);
        changeTimeoutRef.current = null;
      }
      
      // Only change background if:
      // 1. Previously scrolled below hero section
      // 2. Now scrolled back up into hero section (top third)
      // 3. Coming from a position significantly below
      // 4. We haven't changed the background recently (cooldown)
      if (
        hasScrolledBelowHero && 
        currentScrollPos < heroSectionHeight * 0.3 && 
        prevScrollPos > currentScrollPos && 
        prevScrollPos - currentScrollPos > 30 && // Further reduced threshold
        currentTime - lastChangeTimeRef.current > CHANGE_COOLDOWN
      ) {
        // Use a timeout to debounce the change and make sure scrolling has stabilized
        changeTimeoutRef.current = window.setTimeout(() => {
          const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
          selectNextBackground(imagesToUse); // Use sequential rotation instead of random
          setHasScrolledBelowHero(false); // Reset the flag
          lastChangeTimeRef.current = Date.now();
          console.log("Changing background - returning to hero from below");
          changeTimeoutRef.current = null;
        }, 50); // Further reduced timeout for more immediate response
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    // Use both document and window for better coverage
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      if (changeTimeoutRef.current) {
        window.clearTimeout(changeTimeoutRef.current);
      }
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, contentBackgroundUrls, hasScrolledBelowHero]); 

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
