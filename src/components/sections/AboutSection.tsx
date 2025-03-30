
import React, { forwardRef } from "react";
import WorkInProgress from "@/components/WorkInProgress";

interface AboutSectionProps {
  title?: string;
  aboutInfo?: string;
  shouldShowAbout: boolean;
}

const AboutSection = forwardRef<HTMLElement, AboutSectionProps>(({
  title = "About Me",
  aboutInfo = "Learn more about my journey and experience.",
  shouldShowAbout,
}, ref) => {
  return (
    <section 
      ref={ref}
      data-about-section
      className={`min-h-screen bg-transparent px-6 md:px-12 lg:px-24 py-20 transition-opacity duration-500 relative ${
        shouldShowAbout ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">{title}</h2>
        
        {aboutInfo && (
          <div className="mb-12 text-center text-gray-700">
            <p className="text-lg">{aboutInfo}</p>
          </div>
        )}
        
        <div className="flex justify-center items-center mb-8">
          <WorkInProgress />
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
