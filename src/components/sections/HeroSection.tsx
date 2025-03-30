
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { ArrowDown } from "lucide-react";
import { HomeContent } from "@/hooks/useHomeContent";
import { jsonToHtml } from "@contentstack/json-rte-serializer";

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
  const [isRotated, setIsRotated] = useState(false);
  const [rteHtml, setRteHtml] = useState<string>("");
  
  useEffect(() => {
    rootRef.current = document.getElementById('root');
    
    // Check if the site is rotated on load and reset it
    if (rootRef.current && rootRef.current.classList.contains('rotate-full')) {
      rootRef.current.classList.remove('rotate-full');
      setIsRotated(false);
    }
  }, []);
  
  useEffect(() => {
    if (homeContent?.description?.json) {
      try {
        // Convert json to html using jsonToHtml function
        const html = jsonToHtml(homeContent.description.json);
        setRteHtml(html);
      } catch (error) {
        console.error("Error parsing RTE content:", error);
        setRteHtml("<p>Error rendering content</p>");
      }
    }
  }, [homeContent?.description?.json]);
  
  const triggerEasterEgg = (e: React.MouseEvent) => {
    // Get the clicked element text content
    const target = e.target as HTMLElement;
    const header = homeContent?.header || '';
    const lastChar = header.charAt(header.length - 1);
    
    // Calculate click position relative to the target element
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Get the width of text content up to the last character
    const textWithoutLastChar = header.slice(0, -1);
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.fontSize = window.getComputedStyle(target).fontSize;
    tempSpan.style.fontFamily = window.getComputedStyle(target).fontFamily;
    tempSpan.style.fontWeight = window.getComputedStyle(target).fontWeight;
    tempSpan.innerText = textWithoutLastChar;
    document.body.appendChild(tempSpan);
    
    const textWidth = tempSpan.getBoundingClientRect().width;
    document.body.removeChild(tempSpan);
    
    // Check if click is on the last character when normal, or first character when upside down
    const lastCharWidth = rect.width - textWidth;
    let isTargetCharClicked = false;
    
    if (!isRotated) {
      // When in normal position, check for click on last character
      isTargetCharClicked = x > textWidth && x <= rect.width;
    } else {
      // When upside down, check for click on first character (which appears on the right)
      isTargetCharClicked = x >= 0 && x < (rect.width - textWidth);
    }
    
    console.log('Click position:', x, 'Text width:', textWidth, 'Element width:', rect.width, 'Is rotated:', isRotated);
    
    if (isTargetCharClicked && rootRef.current) {
      console.log('Easter egg activated! Clicked on the target character');
      
      // Toggle the rotate-full class to flip the site 180 degrees or back to normal
      rootRef.current.classList.toggle('rotate-full');
      setIsRotated(!isRotated);
      console.log('Rotation toggled:', rootRef.current.classList.contains('rotate-full'));
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
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
            onClick={triggerEasterEgg}
          >
            {homeContent?.header}
          </h1>
          <h2 className="text-xl md:text-2xl text-white/80 mb-6">
            {homeContent?.subheader}
          </h2>
          <div className="text-lg text-white/70 mb-10 max-w-md rich-text-content">
            {rteHtml ? (
              <div dangerouslySetInnerHTML={{ __html: rteHtml }} />
            ) : (
              homeContent?.description && (
                <p>Loading description...</p>
              )
            )}
          </div>
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
