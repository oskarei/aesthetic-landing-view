
import React, { forwardRef, useEffect, useState } from "react";
import WorkInProgress from "@/components/WorkInProgress";
import { motion } from "framer-motion";
import { ContentstackJsonRteSerializer } from "@contentstack/json-rte-serializer";

interface AboutSectionProps {
  title?: string;
  aboutInfo?: string;
  about_the_site?: {
    json: any;
  };
  shouldShowAbout: boolean;
}

const AboutSection = forwardRef<HTMLElement, AboutSectionProps>(({
  title = "About Me",
  aboutInfo,
  about_the_site,
  shouldShowAbout,
}, ref) => {
  const [rteHtml, setRteHtml] = useState<string>("");
  
  useEffect(() => {
    if (about_the_site?.json) {
      try {
        // Initialize the serializer
        const jsonRteSerializer = new ContentstackJsonRteSerializer();
        // Convert json to html
        const html = jsonRteSerializer.toHTML(about_the_site.json);
        setRteHtml(html);
      } catch (error) {
        console.error("Error parsing RTE content:", error);
        setRteHtml("<p>Error rendering content</p>");
      }
    }
  }, [about_the_site]);

  return (
    <section 
      ref={ref}
      data-about-section
      className={`min-h-screen px-6 md:px-12 lg:px-24 py-20 transition-opacity duration-700 relative ${
        shouldShowAbout ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative z-10 text-white">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: shouldShowAbout ? 1 : 0, y: shouldShowAbout ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl font-bold mb-6 text-left"
        >
          {title}
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: shouldShowAbout ? 1 : 0, y: shouldShowAbout ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12 text-left"
        >
          {about_the_site && rteHtml ? (
            <div 
              className="text-lg rich-text-content" 
              dangerouslySetInnerHTML={{ __html: rteHtml }}
            />
          ) : (
            <p className="text-lg">
              {aboutInfo || `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, 
              nisl nunc euismod nisi, eu porttitor nisl nisl euismod nisi.`}
            </p>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: shouldShowAbout ? 1 : 0, y: shouldShowAbout ? 0 : 40 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-start items-center mb-8"
        >
          <WorkInProgress />
        </motion.div>
      </div>
    </section>
  );
});

AboutSection.displayName = "AboutSection";

export default AboutSection;
