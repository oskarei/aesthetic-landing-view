
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
      className="mb-6"
    >
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start text-xl font-medium text-black hover:text-primary hover:bg-black/5",
          active && "text-primary font-semibold"
        )}
        onClick={onClick}
      >
        {label}
      </Button>
    </motion.li>
  );
};

interface HamburgerMenuProps {
  scrollToGallery: () => void;
  scrollToAbout: () => void;
}

const HamburgerMenu = ({ scrollToGallery, scrollToAbout }: HamburgerMenuProps) => {
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

  const goToTop = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToRecipes = () => {
    navigate('/matur');
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="flex justify-end p-5">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="rounded-full hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={24} className="text-black" />
              </Button>
            </div>
            
            <div className="px-8 py-12">
              <motion.ul className="flex flex-col space-y-2">
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
                <NavItem 
                  label="About" 
                  onClick={() => handleNavigation(scrollToAbout)}
                  active={false}
                />
                <NavItem 
                  label="Recipes (in Icelandic)" 
                  onClick={() => handleNavigation(goToRecipes)}
                  active={location.pathname === '/matur'}
                />
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HamburgerMenu;
