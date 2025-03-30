
import React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface LightboxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const LightboxDialog = ({ isOpen, onClose, imageUrl }: LightboxDialogProps) => {
  // Handle the escape key press
  React.useEffect(() => {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent shadow-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Fullscreen view"
              className="max-w-full max-h-[90vh] object-contain"
            />
          )}
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
