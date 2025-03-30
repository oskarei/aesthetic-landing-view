
import BackgroundImage from "@/components/BackgroundImage";
import MainContent from "@/components/MainContent";
import { useEffect } from "react";

const Index = () => {
  // Add an effect to log when the component mounts to help with debugging
  useEffect(() => {
    console.log("Index component mounted");
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <BackgroundImage />
      <MainContent />
    </div>
  );
};

export default Index;
