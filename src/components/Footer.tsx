
import { useHomeContent } from "@/hooks/useHomeContent";

const Footer = () => {
  const { homeContent, loading, error } = useHomeContent();

  return (
    <footer className="w-full py-6 px-6 bg-black/60 backdrop-blur-md text-white border-t border-white/10">
      <div className="container mx-auto">
        {loading && <p className="text-white/50">Loading content...</p>}
        {error && <p className="text-white/70">Error loading content</p>}
        {homeContent && <p>Home Title: {homeContent.title}</p>}
        {!homeContent && !loading && <p>No content available</p>}
      </div>
    </footer>
  );
};

export default Footer;
