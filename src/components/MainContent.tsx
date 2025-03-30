import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ContactSheet from "./ContactSheet";
import { useHomeContent } from "@/hooks/useHomeContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "react-intersection-observer";
import { ArrowDown } from "lucide-react";
import LightboxDialog from "./LightboxDialog";
import { Skeleton } from "@/components/ui/skeleton";

const MainContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { homeContent, loading } = useHomeContent();
  const [contactButtonText, setContactButtonText] = useState("Get in Touch");
  const [backgroundVisible, setBackgroundVisible] = useState(true);
  const [backgroundImages, setBackgroundImages] = useState<Array<{url: string, description?: string}>>([]);
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });

  const { ref: heroExitRef, inView: heroIsVisible } = useInView({
    threshold: 0.1,
    rootMargin: "-100px 0px",
  });

  useEffect(() => {
    if (homeContent?.title) {
      document.title = homeContent.title;
    }
    
    if (homeContent?.contact_button && homeContent.contact_button.length > 0) {
      const randomIndex = Math.floor(Math.random() * homeContent.contact_button.length);
      setContactButtonText(homeContent.contact_button[randomIndex]);
    }

    if (homeContent?.backgroundConnection?.edges?.length) {
      const images = homeContent.backgroundConnection.edges.map(edge => ({
        url: edge.node.url,
        description: edge.node.description
      }));
      setBackgroundImages(images);
      
      const initialLoadingStates: {[key: string]: boolean} = {};
      images.forEach(image => {
        initialLoadingStates[image.url] = true;
      });
      setLoadingStates(initialLoadingStates);
    }
  }, [homeContent]);

  useEffect(() => {
    setBackgroundVisible(heroInView);
  }, [heroInView]);

  const shouldShowGallery = !heroIsVisible;

  const openLightbox = (imageUrl: string, caption?: string) => {
    setCurrentImage(imageUrl);
    setCurrentCaption(caption || null);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setCurrentImage(null);
    setCurrentCaption(null);
  };

  const handleImageLoaded = (imageUrl: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };

  const getThumbnailUrl = (imageUrl: string) => {
    const baseUrl = imageUrl.split('?')[0];
    return `${baseUrl}?width=300&height=300&fit=crop`;
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <header className="p-6 flex justify-end sticky top-0 z-20">
        {/* ThemeToggle removed */}
      </header>

      <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
        <div className="flex flex-col">
          <section 
            ref={(node) => {
              if (node) {
                heroRef(node);
                heroExitRef(node);
              }
            }}
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
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  {homeContent?.header}
                </h1>
                <h2 className="text-xl md:text-2xl text-white/80 mb-6">
                  {homeContent?.subheader}
                </h2>
                <p className="text-lg text-white/70 mb-10 max-w-md">
                  {homeContent?.bio}
                </p>
                <div className="flex flex-col items-start">
                  <Button
                    onClick={() => setIsContactOpen(true)}
                    className="bg-white text-black hover:bg-white/90 px-6 py-6 text-lg rounded-full mb-10"
                  >
                    {contactButtonText}
                  </Button>
                  <div className="flex justify-center w-full">
                    <ArrowDown 
                      className="animate-bounce text-white" 
                      size={32}
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          <section 
            className={`min-h-screen bg-black/80 px-6 md:px-12 lg:px-24 py-20 transition-opacity duration-500 ${
              shouldShowGallery ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Background Gallery</h2>
            
            <div className="mb-12 relative mx-auto max-w-6xl">
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
                          <CardContent 
                            className="flex aspect-square items-center justify-center p-0 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openLightbox(image.url, image.description)}
                          >
                            <div className="relative w-full h-full">
                              {loadingStates[image.url] && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Skeleton className="w-full h-full rounded-md" />
                                </div>
                              )}
                              
                              <img
                                src={`${image.url}?quality=10&width=20&height=20&blur=20`}
                                alt={image.description || `Placeholder ${index + 1}`}
                                className="absolute inset-0 w-full h-full object-cover rounded-md filter blur-md transition-opacity duration-300"
                                style={{ opacity: loadingStates[image.url] ? 1 : 0 }}
                              />
                              
                              <img
                                src={getThumbnailUrl(image.url)}
                                alt={image.description || `Background ${index + 1}`}
                                className="w-full h-full object-cover rounded-md transition-opacity duration-500"
                                style={{ opacity: loadingStates[image.url] ? 0 : 1 }}
                                onLoad={() => handleImageLoaded(image.url)}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                  <CarouselPrevious className="relative left-0" />
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2">
                  <CarouselNext className="relative right-0" />
                </div>
              </Carousel>
            </div>

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

          <section className="min-h-screen bg-black/90 px-6 md:px-12 lg:px-24 py-20">
            <div className="max-w-3xl mx-auto text-white/90">
              <h3 className="text-3xl font-bold mb-6">My Experience</h3>
              <p className="mb-4 text-lg">
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; 
                Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Nulla quis 
                lorem ut libero malesuada feugiat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
              </p>
              <p className="mb-4 text-lg">
                Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vivamus magna justo, 
                lacinia eget consectetur sed, convallis at tellus. Vestibulum ac diam sit amet quam 
                vehicula elementum sed sit amet dui. Donec rutrum congue leo eget malesuada.
              </p>
              <p className="mb-4 text-lg">
                Nulla porttitor accumsan tincidunt. Curabitur aliquet quam id dui posuere blandit. 
                Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Praesent sapien massa, 
                convallis a pellentesque nec, egestas non nisi.
              </p>
            </div>
          </section>
        </div>
      </ScrollArea>

      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-700 z-[-1] ${
          backgroundVisible ? 'opacity-0' : 'opacity-100'
        }`} 
      />

      <ContactSheet 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />

      <LightboxDialog 
        isOpen={isLightboxOpen} 
        onClose={closeLightbox} 
        imageUrl={currentImage}
        caption={currentCaption} 
      />
    </div>
  );
};

export default MainContent;
