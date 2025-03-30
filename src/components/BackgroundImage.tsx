
import { useEffect, useState } from "react";
import { backgroundImages } from "@/config/portfolioConfig";
import { useHomeContent } from "@/hooks/useHomeContent";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { homeContent, loading } = useHomeContent();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [contentBackgroundUrls, setContentBackgroundUrls] = useState<string[]>([]);

  // Get all background URLs from the content
  useEffect(() => {
    if (homeContent?.backgroundConnection?.edges?.length) {
      const urls = homeContent.backgroundConnection.edges.map(edge => edge.node.url);
      setContentBackgroundUrls(urls);
      selectRandomBackground(urls);
    } else if (!loading && backgroundImages.length) {
      // Fallback to config backgrounds if no content backgrounds are available
      selectRandomBackground(backgroundImages);
    }
  }, [homeContent, loading]);

  // Function to select a random background image that's different from the current one
  const selectRandomBackground = (images: string[]) => {
    if (images.length > 1) {
      let newIndex;
      const currentImage = backgroundImage;
      
      // Make sure we select a different image than the current one
      do {
        newIndex = Math.floor(Math.random() * images.length);
      } while (images[newIndex] === currentImage && images.length > 1);
      
      setBackgroundImage(images[newIndex]);
      console.log("Background changed to index:", newIndex);
    } else if (images.length === 1) {
      setBackgroundImage(images[0]);
      console.log("Only one background image available");
    }
  };

  // Add scroll event listener to change background when scrolling back to top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // If we're scrolling up and within the top section of the page
      if (prevScrollPos > currentScrollPos && currentScrollPos < 200) {
        // Only change if we've scrolled a significant amount and now going back up
        if (prevScrollPos - currentScrollPos > 50) {
          const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
          selectRandomBackground(imagesToUse);
          console.log("Changing background - scroll position:", currentScrollPos, "prev:", prevScrollPos);
        }
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    // Use both document and window for better coverage
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      document.removeEventListener('scroll', handleScroll);
      window.addEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, contentBackgroundUrls, backgroundImage]); // Add backgroundImage as a dependency

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
