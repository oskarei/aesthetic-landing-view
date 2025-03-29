
import { useEffect, useState } from "react";
import { useHomeContent } from "@/hooks/useHomeContent";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { homeContent, loading } = useHomeContent();

  useEffect(() => {
    if (homeContent?.background && homeContent.background.length > 0) {
      // Select random background image from the ones provided in Contentstack
      const randomIndex = Math.floor(Math.random() * homeContent.background.length);
      setBackgroundImage(homeContent.background[randomIndex].url);
    }
  }, [homeContent]);

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
