
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
      className={`min-h-screen px-6 md:px-12 lg:px-24 py-20 transition-opacity duration-700 relative ${
        shouldShowAbout ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative z-10 text-white">
        <h2 className="text-4xl font-bold mb-6 text-left">{title}</h2>
        
        <div className="mb-12 text-left">
          <p className="text-lg">
            {aboutInfo || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, 
            nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi. Sed euismod, urna eu tincidunt consectetur,
            nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi.`}
          </p>
          <p className="text-lg mt-4">
            Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi.
            Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi.
          </p>
        </div>
        
        <div className="flex justify-start items-center mb-8">
          <WorkInProgress />
        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
