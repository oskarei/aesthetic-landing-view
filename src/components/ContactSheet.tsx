
import { X } from "lucide-react";
import { contactInfo } from "@/config/portfolioConfig";
import { Button } from "@/components/ui/button";

interface ContactSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactSheet = ({ isOpen, onClose }: ContactSheetProps) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={onClose}
        ></div>
      )}
      
      {/* Contact sheet */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white dark:bg-gray-900 z-50 shadow-lg transform ${
          isOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full animate-slide-out-right'
        } transition-transform duration-300 ease-out`}
      >
        <div className="h-full flex flex-col p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Contact</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-1">{contactInfo.name}</h3>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{contactInfo.location}</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Get in touch</h4>
              <a 
                href={`mailto:${contactInfo.email}`} 
                className="text-primary hover:underline block mb-6"
              >
                {contactInfo.email}
              </a>
              
              <div className="flex space-x-4">
                {contactInfo.socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                      aria-label={link.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactSheet;
