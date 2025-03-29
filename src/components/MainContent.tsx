
import { useState } from "react";
import { portfolioContent } from "@/config/portfolioConfig";
import { Button } from "@/components/ui/button";
import ContactSheet from "./ContactSheet";

const MainContent = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-end">
        {/* ThemeToggle removed */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center px-6 md:px-12 lg:px-24">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            {portfolioContent.title}
          </h1>
          <h2 className="text-xl md:text-2xl text-white/80 mb-6">
            {portfolioContent.subtitle}
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-md">
            {portfolioContent.description}
          </p>
          <Button
            onClick={() => setIsContactOpen(true)}
            className="bg-white text-black hover:bg-white/90 px-6 py-6 text-lg rounded-full"
          >
            Get in Touch
          </Button>
        </div>
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
