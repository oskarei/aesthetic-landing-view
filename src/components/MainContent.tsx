
import { useState, useEffect, useRef } from "react";
import ContactSheet from "./ContactSheet";
import { useHomeContent } from "@/hooks/useHomeContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import LightboxDialog from "./LightboxDialog";
import HeroSection from "./sections/HeroSection";
import GallerySection from "./sections/GallerySection";

const MainContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { homeContent, loading } = useHomeContent();
  const [contactButtonText, setContactButtonText] = useState("Get in Touch");
  const [backgroundVisible, setBackgroundVisible] = useState(true);
  const [backgroundImages, setBackgroundImages] = useState<Array<{url: string, description?: string}>>([]);
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  
  const contactButtonRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { ref: contactButtonInViewRef, inView: contactButtonInView } = useInView({
    threshold: 0.2,
    rootMargin: "-100px 0px",
  });

  const setContactButtonRef = (element: HTMLDivElement | null) => {
    contactButtonRef.current = element;
    
    if (typeof contactButtonInViewRef === 'function') {
      contactButtonInViewRef(element);
    }
  };

  useEffect(() => {
    if (homeContent?.title) {
      document.title = homeContent.title;
    }
    
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

  useEffect(() => {
    setBackgroundVisible(contactButtonInView);
  }, [contactButtonInView]);

  const shouldShowGallery = !contactButtonInView;

  const scrollToGallery = () => {
    if (galleryRef.current) {
      console.log("Scrolling to gallery at position:", galleryRef.current.offsetTop);
      
      // Try multiple approaches to ensure scrolling works
      // 1. Using the ScrollArea ref if available
      if (scrollAreaRef.current) {
        const viewportElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewportElement) {
          (viewportElement as HTMLElement).scrollTo({
            top: galleryRef.current.offsetTop,
            behavior: 'smooth'
          });
        } else {
          scrollAreaRef.current.scrollTo({
            top: galleryRef.current.offsetTop,
            behavior: 'smooth'
          });
        }
      }
      
      // 2. Fallback to window scroll as an additional method
      window.scrollTo({
        top: galleryRef.current.offsetTop,
        behavior: 'smooth'
      });
    } else {
      console.log("Gallery ref is null:", { 
        galleryRef: !!galleryRef.current, 
        scrollAreaRef: !!scrollAreaRef.current 
      });
    }
  };

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

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <header className="p-6 flex justify-end sticky top-0 z-20">
        {/* ThemeToggle removed */}
      </header>

      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 h-[calc(100vh-4rem)]"
      >
        <div className="flex flex-col">
          <HeroSection 
            loading={loading}
            homeContent={homeContent}
            contactButtonText={contactButtonText}
            setIsContactOpen={setIsContactOpen}
            contactButtonRef={setContactButtonRef}
            scrollToGallery={scrollToGallery}
          />

          <GallerySection
            ref={galleryRef}
            backgroundImages={backgroundImages}
            loadingStates={loadingStates}
            handleImageLoaded={handleImageLoaded}
            openLightbox={openLightbox}
            getThumbnailUrl={getThumbnailUrl}
            shouldShowGallery={shouldShowGallery}
            sectionHeadline={homeContent?.background_section_headline}
            backgroundInfo={homeContent?.background_info}
          />
        </div>
      </ScrollArea>

      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-700 z-[-1] ${
          backgroundVisible ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      <ContactSheet 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      <LightboxDialog 
        isOpen={isLightboxOpen} 
        onClose={closeLightbox} 
        imageUrl={currentImage}
        caption={currentCaption} 
      />
    </div>
  );
};

export default MainContent;
