
import { useRef, RefObject } from "react";
import { useInView } from "react-intersection-observer";

export const useScrollSections = () => {
  const contactButtonRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Set up InView hooks with appropriate thresholds
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

  // Helper functions to set combined refs
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

  // Scroll to section functions
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

  // Calculate visibility state for sections
  const shouldShowGallery = galleryInView || (!contactButtonInView && !aboutInView);
  const shouldShowAbout = aboutInView || (!galleryInView && !contactButtonInView);

  return {
    contactButtonRef: setContactButtonRef,
    galleryRef: setGalleryRef,
    aboutRef: setAboutRef,
    scrollAreaRef,
    contactButtonInView,
    galleryInView,
    aboutInView,
    scrollToGallery,
    scrollToAbout,
    shouldShowGallery,
    shouldShowAbout
  };
};
