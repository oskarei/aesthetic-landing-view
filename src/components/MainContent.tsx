import { useState, useEffect, useRef } from "react";
import ContactSheet from "./ContactSheet";
import { useHomeContent } from "@/hooks/useHomeContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInView } from "react-intersection-observer";
import LightboxDialog from "./LightboxDialog";
import HeroSection from "./sections/HeroSection";
import GallerySection from "./sections/GallerySection";
import AboutSection from "./sections/AboutSection";
import HamburgerMenu from "./HamburgerMenu";

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
  const aboutRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { ref: contactButtonInViewRef, inView: contactButtonInView } = useInView({
    threshold: 0.3,
    rootMargin: "-100px 0px",
  });

  const { ref: galleryInViewRef, inView: galleryInView } = useInView({
    threshold: 0.8,
    rootMargin: "-50px 0px",
  });

  const { ref: aboutInViewRef, inView: aboutInView } = useInView({
    threshold: 0.6,
    rootMargin: "-50px 0px",
  });

  const setContactButtonRef = (element: HTMLDivElement | null) => {
    contactButtonRef.current = element;
    
    if (typeof contactButtonInViewRef === 'function') {
      contactButtonInViewRef(element);
    }
  };

  const setGalleryRef = (element: HTMLElement | null) => {
    galleryRef.current = element;
    
    if (typeof galleryInViewRef === 'function') {
      galleryInViewRef(element);
    }
  };

  const setAboutRef = (element: HTMLElement | null) => {
    aboutRef.current = element;
    
    if (typeof aboutInViewRef === 'function') {
      aboutInViewRef(element);
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
    const isFullyInGallery = galleryInView && !contactButtonInView && !aboutInView;
    setBackgroundVisible(!isFullyInGallery);
  }, [contactButtonInView, galleryInView, aboutInView]);

  const shouldShowGallery = galleryInView || (!contactButtonInView && !aboutInView);
  const shouldShowAbout = aboutInView || (!galleryInView && !contactButtonInView);

  const scrollToGallery = () => {
    if (galleryRef.current) {
      console.log("Scrolling to gallery at position:", galleryRef.current.offsetTop);
      
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

  const scrollToAbout = () => {
    if (aboutRef.current) {
      console.log("Scrolling to about section at position:", aboutRef.current.offsetTop);
      
      if (scrollAreaRef.current) {
        const viewportElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewportElement) {
          (viewportElement as HTMLElement).scrollTo({
            top: aboutRef.current.offsetTop,
            behavior: 'smooth'
          });
        } else {
          scrollAreaRef.current.scrollTo({
            top: aboutRef.current.offsetTop,
            behavior: 'smooth'
          });
        }
      }
      
      window.scrollTo({
        top: aboutRef.current.offsetTop,
        behavior: 'smooth'
      });
    } else {
      console.log("About ref is null");
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
        <HamburgerMenu scrollToGallery={scrollToGallery} scrollToAbout={scrollToAbout} />
      </header>

      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 h-[calc(100vh-4rem)]"
        data-scroll-container
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
            ref={setGalleryRef}
            backgroundImages={backgroundImages}
            loadingStates={loadingStates}
            handleImageLoaded={handleImageLoaded}
            openLightbox={openLightbox}
            getThumbnailUrl={getThumbnailUrl}
            shouldShowGallery={shouldShowGallery}
            sectionHeadline={homeContent?.background_section_headline}
            backgroundInfo={homeContent?.background_info}
            title={homeContent?.title}
          />

          <AboutSection
            ref={setAboutRef}
            shouldShowAbout={shouldShowAbout}
            title={homeContent?.title}
            aboutInfo={homeContent?.bio}
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
