
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { ArrowDown } from "lucide-react";
import { HomeContent } from "@/hooks/useHomeContent";

interface HeroSectionProps {
  loading: boolean;
  homeContent?: HomeContent;
  contactButtonText: string;
  setIsContactOpen: (isOpen: boolean) => void;
  contactButtonRef: (element: HTMLDivElement | null) => void;
  scrollToGallery: () => void;
}

const HeroSection = ({ 
  loading, 
  homeContent, 
  contactButtonText, 
  setIsContactOpen,
  contactButtonRef,
  scrollToGallery
}: HeroSectionProps) => {
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  const rootRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    rootRef.current = document.getElementById('root');
  }, []);
  
  const triggerEasterEgg = (text: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const clickedChar = (target.innerText || '').charAt(target.innerText.length - 1);
    const lastChar = text.charAt(text.length - 1);
    
    if (clickedChar === lastChar && target.innerText.endsWith(lastChar)) {
      console.log('Easter egg activated!');
      
      if (rootRef.current) {
        rootRef.current.classList.remove('rotate-full');
        // Force a reflow so the animation can be triggered again
        void rootRef.current.offsetWidth;
        rootRef.current.classList.add('rotate-full');
      }
    }
  };

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex items-center px-6 md:px-12 lg:px-24 transition-opacity duration-500 relative"
    >
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-white/20 rounded w-3/4"></div>
          <div className="h-6 bg-white/20 rounded w-1/2"></div>
          <div className="h-24 bg-white/20 rounded w-full"></div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight cursor-pointer"
            onClick={(e) => homeContent?.header && triggerEasterEgg(homeContent.header, e)}
          >
            {homeContent?.header}
          </h1>
          <h2 className="text-xl md:text-2xl text-white/80 mb-6">
            {homeContent?.subheader}
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-md">
            {homeContent?.bio}
          </p>
          <div className="flex flex-col items-start">
            <div ref={contactButtonRef}>
              <Button
                onClick={() => setIsContactOpen(true)}
                className="bg-white text-black hover:bg-white/90 px-6 py-6 text-lg rounded-full mb-10"
              >
                {contactButtonText}
              </Button>
            </div>
            <div className="flex justify-center w-full">
              <div className="flex justify-center w-full absolute left-0 right-0">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Arrow clicked, scrolling to gallery");
                    scrollToGallery();
                  }}
                  className="bg-transparent border-none cursor-pointer transition-transform hover:translate-y-1 focus:outline-none p-5"
                  aria-label="Scroll to gallery"
                >
                  <ArrowDown 
                    className="animate-bounce text-white" 
                    size={32}
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
