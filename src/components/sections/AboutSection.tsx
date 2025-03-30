
import React, { forwardRef } from "react";
import WorkInProgress from "@/components/WorkInProgress";

interface AboutSectionProps {
  title?: string;
  aboutInfo?: string;
  shouldShowAbout: boolean;
}

const AboutSection = forwardRef<HTMLElement, AboutSectionProps>(({
  title = "About Me",
  aboutInfo,
  shouldShowAbout,
}, ref) => {
  return (
    <section 
      ref={ref}
      data-about-section
      className={`min-h-screen px-6 md:px-12 lg:px-24 py-20 transition-opacity duration-500 relative ${
        shouldShowAbout ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative z-10 max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-left">{title}</h2>
        
        {!aboutInfo && (
          <div className="mb-12 text-left text-gray-700">
            <p className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, 
              nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi. Sed euismod, urna eu tincidunt consectetur,
              nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi.
            </p>
            <p className="text-lg mt-4">
              Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi.
              Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi.
            </p>
          </div>
        )}
        
        {aboutInfo && (
          <div className="mb-12 text-left text-gray-700">
            <p className="text-lg">{aboutInfo}</p>
          </div>
        )}
        
        <div className="flex justify-start items-center mb-8">
          <WorkInProgress />
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
