
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type NavItemProps = {
  label: string;
  onClick: () => void;
  active?: boolean;
};

const NavItem = ({ label, onClick, active }: NavItemProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start text-lg font-medium text-white hover:text-primary hover:bg-white/10",
          active && "text-primary"
        )}
        onClick={onClick}
      >
        {label}
      </Button>
    </motion.li>
  );
};

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (action: () => void) => {
    // Apply fade effect by adding a temporary overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black z-50 animate-fade-in';
    document.body.appendChild(overlay);
    
    // Close the menu first
    setIsOpen(false);
    
    // Wait for fade-in animation before navigation
    setTimeout(() => {
      action();
      
      // Remove overlay with fade-out animation
      overlay.classList.replace('animate-fade-in', 'animate-fade-out');
      
      // Remove overlay element after animation completes
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }, 200);
  };

  const scrollToGallery = () => {
    const gallerySection = document.querySelector('[data-gallery-section]');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToTop = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed top-5 right-5 z-30">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 right-0 w-60 bg-black/80 backdrop-blur-md rounded-lg p-4 shadow-lg"
          >
            <motion.ul className="flex flex-col space-y-1">
              <NavItem 
                label="To the Top!" 
                onClick={() => handleNavigation(goToTop)} 
                active={location.pathname === '/' && window.scrollY < 100}
              />
              <NavItem 
                label="Gallery" 
                onClick={() => handleNavigation(scrollToGallery)}
                active={false}
              />
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HamburgerMenu;
