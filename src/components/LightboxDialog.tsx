
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
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null);
  const [placeholderUrl, setPlaceholderUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Generate optimized image URLs using Contentstack's Image Delivery API
  useEffect(() => {
    if (imageUrl) {
      // Create a placeholder blurred version (50x50)
      const blurredPlaceholder = `${imageUrl}?quality=10&width=50&height=50&blur=30`;
      setPlaceholderUrl(blurredPlaceholder);
      
      // Create a medium-sized thumbnail for immediate display (600px wide)
      const thumbnail = `${imageUrl}?quality=60&width=600`;
      setThumbnailUrl(thumbnail);
      
      // Create an optimized full-size version
      // Using width=1600 as a reasonable max size for most screens
      const optimized = `${imageUrl}?quality=85&width=1600`;
      setOptimizedImageUrl(optimized);
      
      // Reset loading state when image URL changes
      setLoading(true);
      // Reset zoom when changing images
      setZoomLevel(1);
    } else {
      setOptimizedImageUrl(null);
      setPlaceholderUrl(null);
      setThumbnailUrl(null);
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
          {(optimizedImageUrl || thumbnailUrl) && (
            <div className="relative overflow-hidden flex-1">
              {/* Blurred small placeholder shown while thumbnail loads */}
              {loading && placeholderUrl && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <img
                    src={placeholderUrl}
                    alt="Loading preview"
                    className="w-full h-full object-contain filter blur-lg opacity-70 transition-opacity duration-300"
                  />
                  <Skeleton className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20" />
                </div>
              )}
              
              {/* Medium resolution thumbnail shown while high-res image loads */}
              {loading && thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Loading preview"
                  className="max-w-full max-h-[80vh] object-contain transition-opacity duration-300"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              )}
              
              {/* Main optimized image */}
              <img
                src={optimizedImageUrl}
                alt="Fullscreen view"
                className={`max-w-full max-h-[80vh] object-contain transition-all duration-300 ease-in-out ${loading ? 'opacity-0' : 'opacity-100'}`}
                style={{ transform: `scale(${zoomLevel})` }}
                onLoad={() => setLoading(false)}
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
