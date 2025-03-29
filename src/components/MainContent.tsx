
import { useState, useEffect } from "react";
import { portfolioContent } from "@/config/portfolioConfig";
import { Button } from "@/components/ui/button";
import ContactSheet from "./ContactSheet";
import ContentstackExample from "./ContentstackExample";
import { getEntries } from "@/utils/contentstackClient";

interface HomeContent {
  title?: string;
  subheader?: string;
  bio?: string;
  [key: string]: any;
}

const MainContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showContentstack, setShowContentstack] = useState(false);
  const [homeData, setHomeData] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await getEntries('home', {
          limit: 1,
        });
        
        if (response && response.entries && response.entries.length > 0) {
          setHomeData(response.entries[0]);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Use content from Contentstack if available, otherwise fall back to local content
  const title = homeData?.title || portfolioContent.title;
  const subtitle = homeData?.subheader || portfolioContent.subtitle;
  const description = homeData?.bio || portfolioContent.description;

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-end">
        {/* ThemeToggle removed */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 md:px-12 lg:px-24">
        <div className="max-w-xl">
          {loading ? (
            <div className="text-white/70">Loading content...</div>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                {title}
              </h1>
              <h2 className="text-xl md:text-2xl text-white/80 mb-6">
                {subtitle}
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-md">
                {description}
              </p>
            </>
          )}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setIsContactOpen(true)}
              className="bg-white text-black hover:bg-white/90 px-6 py-6 text-lg rounded-full"
            >
              Get in Touch
            </Button>
            <Button
              onClick={() => setShowContentstack(!showContentstack)}
              className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-6 text-lg rounded-full"
            >
              {showContentstack ? "Hide Contentstack" : "Show Contentstack"}
            </Button>
          </div>
        </div>
        
        {showContentstack && (
          <div className="mt-12 w-full max-w-xl">
            <ContentstackExample />
          </div>
        )}
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
