
import React, { forwardRef, useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GallerySectionProps {
  backgroundImages: Array<{url: string, description?: string}>;
  loadingStates: {[key: string]: boolean};
  handleImageLoaded: (imageUrl: string) => void;
  openLightbox: (imageUrl: string, caption?: string) => void;
  getThumbnailUrl: (imageUrl: string) => string;
  shouldShowGallery: boolean;
  sectionHeadline?: string;
  backgroundInfo?: string;
}

const GallerySection = forwardRef<HTMLElement, GallerySectionProps>(({
  backgroundImages,
  loadingStates,
  handleImageLoaded,
  openLightbox,
  getThumbnailUrl,
  shouldShowGallery,
  sectionHeadline = "Background Gallery",
  backgroundInfo
}, ref) => {
  // Add state to hold shuffled images
  const [shuffledImages, setShuffledImages] = useState<Array<{url: string, description?: string}>>([]);
  
  // Shuffle the images when the component mounts or when backgroundImages changes
  useEffect(() => {
    // Create a copy of the backgroundImages array to avoid mutating the original
    const imagesToShuffle = [...backgroundImages];
    
    // Fisher-Yates (Knuth) shuffle algorithm
    for (let i = imagesToShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [imagesToShuffle[i], imagesToShuffle[j]] = [imagesToShuffle[j], imagesToShuffle[i]];
    }
    
    setShuffledImages(imagesToShuffle);
    console.log("Images shuffled:", imagesToShuffle.length);
  }, [backgroundImages]);

  return (
    <section 
      ref={ref}
      className={`min-h-screen bg-white px-6 md:px-12 lg:px-24 py-20 transition-opacity duration-500 ${
        shouldShowGallery ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">{sectionHeadline}</h2>
      
      {backgroundInfo && (
        <div className="max-w-3xl mx-auto mb-12 text-center text-gray-700">
          <p className="text-lg">{backgroundInfo}</p>
        </div>
      )}
      
      <div className="mb-12 relative mx-auto max-w-6xl">
        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {/* Use shuffledImages instead of backgroundImages */}
            {shuffledImages.map((image, index) => (
              <CarouselItem key={index} className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Card className="border border-gray-200 overflow-hidden shadow-sm">
                    <CardContent 
                      className="flex aspect-square items-center justify-center p-0 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openLightbox(image.url, image.description)}
                    >
                      <div className="relative w-full h-full">
                        {loadingStates[image.url] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Skeleton className="w-full h-full rounded-md bg-gray-200" />
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
            <CarouselPrevious className="relative left-0 bg-white text-gray-900 border-gray-200 hover:bg-gray-100" />
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2">
            <CarouselNext className="relative right-0 bg-white text-gray-900 border-gray-200 hover:bg-gray-100" />
          </div>
        </Carousel>
      </div>

      <div className="max-w-3xl mx-auto text-gray-800">
        <h3 className="text-3xl font-bold mb-6 text-gray-900">My Journey</h3>
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
  );
});

GallerySection.displayName = "GallerySection";

export default GallerySection;
