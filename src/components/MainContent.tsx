
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import ContactSheet from "./ContactSheet";
import { useHomeContent } from "@/hooks/useHomeContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

const MainContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { homeContent, loading } = useHomeContent();
  const [contactButtonText, setContactButtonText] = useState("Get in Touch");
  const [backgroundVisible, setBackgroundVisible] = useState(true);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  
  // Use intersection observer for the hero section
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  // Update the page title and collect background images when content is loaded
  useEffect(() => {
    if (homeContent?.title) {
      document.title = homeContent.title;
    }
    
    // Set random contact button text from the array if available
    if (homeContent?.contact_button && homeContent.contact_button.length > 0) {
      const randomIndex = Math.floor(Math.random() * homeContent.contact_button.length);
      setContactButtonText(homeContent.contact_button[randomIndex]);
    }

    // Collect all background images for the carousel
    if (homeContent?.backgroundConnection?.edges?.length) {
      const images = homeContent.backgroundConnection.edges.map(edge => edge.node.url);
      setBackgroundImages(images);
    }
  }, [homeContent]);

  // Update background visibility based on hero section being in view
  useEffect(() => {
    setBackgroundVisible(heroInView);
  }, [heroInView]);

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-end sticky top-0 z-20">
        {/* ThemeToggle removed */}
      </header>

      {/* Main scrollable content */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {/* Hero section */}
          <section 
            ref={heroRef}
            className="min-h-screen flex items-center px-6 md:px-12 lg:px-24 transition-opacity duration-500"
          >
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
          </section>

          {/* Background Gallery Section */}
          <section className="min-h-screen bg-black/80 px-6 md:px-12 lg:px-24 py-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Background Gallery</h2>
            
            {/* Image Carousel */}
            <div className="mb-12">
              <Carousel 
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-1">
                  {backgroundImages.map((image, index) => (
                    <CarouselItem key={index} className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <Card className="border-0 overflow-hidden">
                          <CardContent className="flex aspect-square items-center justify-center p-0">
                            <img
                              src={image}
                              alt={`Background ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Blog-like content */}
            <div className="max-w-3xl mx-auto text-white/90">
              <h3 className="text-3xl font-bold mb-6">My Journey</h3>
              <p className="mb-4 text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam tincidunt, 
                nisl nunc fermentum nunc, vitae aliquet nunc nisl eu nunc. Sed euismod, diam quis aliquam tincidunt,
                nisl nunc fermentum nunc, vitae aliquet nunc nisl eu nunc.
              </p>
              <p className="mb-4 text-lg">
                Proin eget tortor risus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. 
                Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Nulla quis lorem ut libero 
                malesuada feugiat. Nulla porttitor accumsan tincidunt.
              </p>
              <p className="mb-4 text-lg">
                Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Cras ultricies ligula sed 
                magna dictum porta. Curabitur aliquet quam id dui posuere blandit. Vestibulum ante ipsum primis 
                in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet 
                aliquam vel, ullamcorper sit amet ligula.
              </p>
            </div>
          </section>
        </div>
      </ScrollArea>

      {/* Background fade effect controller */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-700 z-[-1] ${
          backgroundVisible ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      {/* Contact Sheet */}
      <ContactSheet 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </div>
  );
};

export default MainContent;
