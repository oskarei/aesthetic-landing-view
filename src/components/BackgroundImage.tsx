
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

  // Function to select a random background image
  const selectRandomBackground = (images: string[]) => {
    if (images.length) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setBackgroundImage(images[randomIndex]);
      console.log("Images shuffled:", randomIndex);
    }
  };

  // Add scroll event listener to change background when scrolling back to top
  useEffect(() => {
    // We need to listen to the scroll event on the document
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // If we're scrolling back up and near the top (within 100px of the top)
      if (prevScrollPos > currentScrollPos && currentScrollPos < 100) {
        // Only change the background if we're coming from a scrolled position (more than 200px down)
        if (prevScrollPos > 200) {
          const imagesToUse = contentBackgroundUrls.length ? contentBackgroundUrls : backgroundImages;
          selectRandomBackground(imagesToUse);
          console.log("Changing background image on scroll to top");
        }
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    // Add the event listener to the document
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => document.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, contentBackgroundUrls]);

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
