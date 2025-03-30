
import { useState } from "react";

export const useLightbox = () => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);

  const openLightbox = (imageUrl: string, caption?: string) => {
    setCurrentImage(imageUrl);
    setCurrentCaption(caption || null);
    setIsLightboxOpen(true);
    console.log("Opening lightbox with caption:", caption);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentImage(null);
    setCurrentCaption(null);
  };

  return {
    isLightboxOpen,
    currentImage,
    currentCaption,
    openLightbox,
    closeLightbox
  };
};
