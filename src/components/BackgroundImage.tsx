
import { useEffect, useState } from "react";
import { backgroundImages } from "@/config/portfolioConfig";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Select random background image on component mount
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
  }, []);

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
