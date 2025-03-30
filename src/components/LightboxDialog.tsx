
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LightboxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  caption?: string | null;
}

const LightboxDialog = ({ isOpen, onClose, imageUrl, caption }: LightboxDialogProps) => {
  const [loading, setLoading] = useState(true);
  const [fullSizeLoading, setFullSizeLoading] = useState(true);
  const [lowResPlaceholder, setLowResPlaceholder] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Generate placeholder and prepare original image when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      // Create a small blurry placeholder (100px wide)
      const blurredPlaceholder = `${imageUrl}?quality=10&width=100&blur=20`;
      setLowResPlaceholder(blurredPlaceholder);
      
      // Reset loading states when image URL changes
      setLoading(true);
      setFullSizeLoading(true);
      
      // Reset zoom when changing images
      setZoomLevel(1);
    } else {
      setLowResPlaceholder(null);
    }
  }, [imageUrl]);

  // Handle the escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5)); // Min zoom 0.5x
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
        {/* Hidden DialogTitle for accessibility */}
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {imageUrl && (
            <div className="relative overflow-hidden flex-1 w-full h-full flex items-center justify-center">
              {/* Blurry small placeholder shown while original loads */}
              {lowResPlaceholder && (
                <div 
                  className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 ease-in-out ${fullSizeLoading ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img
                    src={lowResPlaceholder}
                    alt="Loading preview"
                    className="w-full h-full object-contain"
                    style={{ 
                      transform: `scale(${zoomLevel})`,
                      filter: 'blur(8px)',
                    }}
                    onLoad={() => setLoading(false)}
                  />
                  
                  {loading && (
                    <Skeleton className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20" />
                  )}
                </div>
              )}
              
              {/* Full-size original image */}
              <img
                src={imageUrl} // Using the original URL without any query parameters
                alt={caption || "Full size image"}
                className="max-w-full max-h-[80vh] object-contain transition-opacity duration-500"
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  opacity: fullSizeLoading ? 0 : 1
                }}
                onLoad={() => setFullSizeLoading(false)}
              />
            </div>
          )}

          {/* Caption */}
          {caption && (
            <div className="w-full max-w-[90vw] px-4 py-3 text-white/90 text-center">
              <p className="text-sm md:text-base break-words">{caption}</p>
            </div>
          )}

          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button 
              onClick={handleZoomOut} 
              className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut size={20} />
              <span className="sr-only">Zoom out</span>
            </button>
            <button 
              onClick={handleZoomIn} 
              className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn size={20} />
              <span className="sr-only">Zoom in</span>
            </button>
          </div>
          
          <DialogClose className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white">
            <X size={24} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LightboxDialog;
