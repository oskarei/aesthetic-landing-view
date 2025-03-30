
import { useState, useEffect } from "react";
import ContactSheet from "./ContactSheet";
import { useHomeContent } from "@/hooks/useHomeContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import LightboxDialog from "./LightboxDialog";
import HeroSection from "./sections/HeroSection";
import GallerySection from "./sections/GallerySection";
import AboutSection from "./sections/AboutSection";
import HamburgerMenu from "./HamburgerMenu";
import { useLightbox } from "@/hooks/useLightbox";
import { useScrollSections } from "@/hooks/useScrollSections";
import { useBackgroundVisibility } from "@/hooks/useBackgroundVisibility";
import { useImageManager } from "@/hooks/useImageManager";

const MainContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { homeContent, loading } = useHomeContent();
  
  // Use our custom hooks
  const { 
    contactButtonText, 
    backgroundImages, 
    loadingStates, 
    handleImageLoaded, 
    getThumbnailUrl 
  } = useImageManager(homeContent);
  
  const {
    isLightboxOpen,
    currentImage,
    currentCaption,
    openLightbox,
    closeLightbox
  } = useLightbox();
  
  const {
    contactButtonRef,
    galleryRef,
    aboutRef,
    scrollAreaRef,
    contactButtonInView,
    galleryInView,
    aboutInView,
    scrollToGallery,
    scrollToAbout,
    shouldShowGallery,
    shouldShowAbout
  } = useScrollSections();
  
  const { backgroundVisible } = useBackgroundVisibility(
    contactButtonInView,
    galleryInView,
    aboutInView
  );

  // Set document title when content loads
  useEffect(() => {
    if (homeContent?.title) {
      document.title = homeContent.title;
    }
  }, [homeContent]);

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
            contactButtonRef={contactButtonRef}
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
            scrollToAbout={scrollToAbout}
          />

          <AboutSection
            ref={aboutRef}
            shouldShowAbout={shouldShowAbout}
            title={homeContent?.title}
            aboutInfo={homeContent?.description ? 
              typeof homeContent.description === 'string' ? 
                homeContent.description : undefined 
              : undefined}
            about_the_site={homeContent?.about_the_site}
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
