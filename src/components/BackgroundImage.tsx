
import { useEffect, useState } from "react";
import { backgroundImages } from "@/config/portfolioConfig";
import { useHomeContent } from "@/hooks/useHomeContent";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { homeContent, loading } = useHomeContent();

  useEffect(() => {
    if (homeContent?.backgroundConnection?.edges?.length) {
      // Get all background URLs from the content
      const contentBackgroundUrls = homeContent.backgroundConnection.edges.map(edge => edge.node.url);
      
      // Select random background image from Contentstack data
      const randomIndex = Math.floor(Math.random() * contentBackgroundUrls.length);
      setBackgroundImage(contentBackgroundUrls[randomIndex]);
    } else if (!loading && backgroundImages.length) {
      // Fallback to config backgrounds if no content backgrounds are available
      const randomIndex = Math.floor(Math.random() * backgroundImages.length);
      setBackgroundImage(backgroundImages[randomIndex]);
    }
  }, [homeContent, loading]);

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
