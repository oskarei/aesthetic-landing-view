
import { useState, useEffect } from "react";
import { HomeContent } from "@/hooks/useHomeContent";

export const useImageManager = (homeContent?: HomeContent) => {
  const [contactButtonText, setContactButtonText] = useState("Get in Touch");
  const [backgroundImages, setBackgroundImages] = useState<Array<{url: string, description?: string}>>([]);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (homeContent?.contact_button && homeContent.contact_button.length > 0) {
      const randomIndex = Math.floor(Math.random() * homeContent.contact_button.length);
      setContactButtonText(homeContent.contact_button[randomIndex]);
    }

    if (homeContent?.backgroundConnection?.edges?.length) {
      const images = homeContent.backgroundConnection.edges.map(edge => ({
        url: edge.node.url,
        description: edge.node.description
      }));
      setBackgroundImages(images);
      
      const initialLoadingStates: {[key: string]: boolean} = {};
      images.forEach(image => {
        initialLoadingStates[image.url] = true;
      });
      setLoadingStates(initialLoadingStates);
    }
  }, [homeContent]);

  const handleImageLoaded = (imageUrl: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };

  const getThumbnailUrl = (imageUrl: string) => {
    const [baseUrl, queryString] = imageUrl.split('?');
    const queryParams = queryString ? `&width=300&height=300&fit=crop` : `?width=300&height=300&fit=crop`;
    return `${baseUrl}${queryParams}`;
  };

  return {
    contactButtonText,
    backgroundImages,
    loadingStates,
    handleImageLoaded,
    getThumbnailUrl
  };
};
