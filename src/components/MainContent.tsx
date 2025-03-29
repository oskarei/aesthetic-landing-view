
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ContactSheet from "./ContactSheet";
import { useHomeContent } from "@/hooks/useHomeContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-end">
        {/* ThemeToggle removed */}
      </header>

      <ScrollArea className="flex-1 overflow-y-auto">
        {/* Main hero content */}
        <main className="min-h-screen flex items-center px-6 md:px-12 lg:px-24 sticky top-0 z-10">
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
                <p className="text-lg text-white/70 mb-10 max-w-md">
                  {homeContent?.bio}
                </p>
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

        {/* Blog style content section */}
        <section className="min-h-screen bg-white text-black px-6 md:px-12 lg:px-24 py-20">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Latest Articles</h2>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">The Art of Creative Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Published on October 15, 2023</p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">Exploring New Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Published on September 28, 2023</p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">The Future of Web Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">Published on August 12, 2023</p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </ScrollArea>

      {/* Contact Sheet */}
      <ContactSheet 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
};

export default MainContent;
