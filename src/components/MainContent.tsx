
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ContactSheet from "./ContactSheet";
import { useHomeContent } from "@/hooks/useHomeContent";
import * as ContentstackRTESerializer from "@contentstack/json-rte-serializer";

const MainContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { homeContent, loading } = useHomeContent();
  const [contactButtonText, setContactButtonText] = useState("Get in Touch");

  // Update the page title when content is loaded
  useEffect(() => {
    if (homeContent?.title) {
      document.title = homeContent.title;
    }
    
    // Set random contact button text from the array if available
    if (homeContent?.contact_button && homeContent.contact_button.length > 0) {
      const randomIndex = Math.floor(Math.random() * homeContent.contact_button.length);
      setContactButtonText(homeContent.contact_button[randomIndex]);
    }
  }, [homeContent]);

  // Debug the JSON content received
  console.log("Description JSON:", homeContent?.description?.json);
  
  // Convert JSON RTE to HTML using the RTE Serializer
  let descriptionHtml = "";
  if (homeContent?.description?.json) {
    try {
      // Import all exports and use the library properly
      descriptionHtml = ContentstackRTESerializer.render(homeContent.description.json, {});
      console.log("HTML output:", descriptionHtml);
    } catch (error) {
      console.error("Error rendering RTE content:", error);
    }
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-end">
        {/* ThemeToggle removed */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center px-6 md:px-12 lg:px-24">
        <div className="max-w-xl">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-white/20 rounded w-3/4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
              <div className="h-24 bg-white/20 rounded w-full"></div>
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                {homeContent?.header}
              </h1>
              <h2 className="text-xl md:text-2xl text-white/80 mb-6">
                {homeContent?.subheader}
              </h2>
              {/* Replace bio text with description HTML */}
              {descriptionHtml ? (
                <div 
                  className="text-lg text-white/70 mb-10 max-w-md prose prose-invert"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              ) : (
                <p className="text-lg text-white/70 mb-10 max-w-md">
                  {homeContent?.bio}
                </p>
              )}
              <Button
                onClick={() => setIsContactOpen(true)}
                className="bg-white text-black hover:bg-white/90 px-6 py-6 text-lg rounded-full"
              >
                {contactButtonText}
              </Button>
            </>
          )}
        </div>
      </main>

      {/* Contact Sheet */}
      <ContactSheet 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
};

export default MainContent;
