
import { useEffect, useState } from "react";
import { useBackgroundTransition } from "@/hooks/useBackgroundTransition";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { currentBackgroundUrl } = useBackgroundTransition();

  // Set the background image when it changes
  useEffect(() => {
    if (currentBackgroundUrl) {
      setBackgroundImage(currentBackgroundUrl);
    }
  }, [currentBackgroundUrl]);

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
