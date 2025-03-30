
import { useState, useEffect } from "react";

export const useBackgroundVisibility = (
  contactButtonInView: boolean,
  galleryInView: boolean,
  aboutInView: boolean
) => {
  const [backgroundVisible, setBackgroundVisible] = useState(true);

  useEffect(() => {
    const isFullyInGallery = galleryInView && !contactButtonInView && !aboutInView;
    setBackgroundVisible(!isFullyInGallery);
  }, [contactButtonInView, galleryInView, aboutInView]);

  return { backgroundVisible };
};
