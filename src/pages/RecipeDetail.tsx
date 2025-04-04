
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeBySlug } from '@/hooks/useRecipeBySlug';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import HamburgerMenu from '@/components/HamburgerMenu';
import { jsonToHtml } from '@contentstack/json-rte-serializer';
import ThemeToggle from '@/components/ThemeToggle';

const LoadingSkeleton = () => (
  <div className="space-y-6 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
    <Skeleton className="h-12 w-[350px]" />
    <Skeleton className="h-6 w-[250px]" />
    <div className="flex gap-2 mt-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-16" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  </div>
);

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { recipe, loading, error } = useRecipeBySlug(slug || '');
  const [darkMode, setDarkMode] = useState(false);

  const scrollToGallery = () => {};
  const scrollToAbout = () => {};

  const goBack = () => {
    navigate(-1);
  };

  const renderRteContent = (bodyContent: string) => {
    try {
      const contentJson = JSON.parse(bodyContent);
      const htmlContent = jsonToHtml(contentJson);
      
      // Process HTML to fix ordered lists and image sizes
      let processedHtml = htmlContent.replace(
        /<ol>/g, 
        '<ol class="list-decimal pl-6 my-4 space-y-2">'
      );
      
      // Fix image sizes - set max-width and height to maintain aspect ratio
      processedHtml = processedHtml.replace(
        /<img([^>]*)>/g,
        '<img$1 style="max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0;" class="shadow-sm">'
      );
      
      return <div className="prose prose-lg max-w-none rich-text-content" dangerouslySetInnerHTML={{ __html: processedHtml }} />;
    } catch (e) {
      return (
        <div className="prose prose-lg max-w-none rich-text-content">
          {bodyContent.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F9F5F2] to-[#F3EBE6] flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md border border-[#E9DFD8]">
          <h1 className="text-2xl font-bold text-red-500">Villa kom upp</h1>
          <p className="mt-2">Uppskriftin fannst ekki.</p>
          <Button onClick={goBack} className="mt-4" variant="outline">
            <ArrowLeft className="mr-2" size={16} />
            Til baka
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode 
      ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100' 
      : 'bg-gradient-to-b from-[#F9F5F2] to-[#F3EBE6] text-gray-800'} transition-colors duration-300`}>
      <header className={`p-6 flex justify-between sticky top-0 z-20 ${darkMode 
        ? 'bg-gray-900/90' 
        : 'bg-white/90'} backdrop-blur border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-sm transition-colors duration-300`}>
        <Button 
          variant={darkMode ? "ghost" : "outline"}
          onClick={goBack} 
          className={`flex items-center gap-2 transition-colors ${darkMode 
            ? 'bg-gray-800/70 hover:bg-gray-700/80 text-gray-200 border-gray-700' 
            : 'bg-white hover:bg-[#F9F5F2] text-gray-700 border-[#E9DFD8]'}`}
        >
          <ArrowLeft size={16} />
          Til baka
        </Button>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <HamburgerMenu scrollToGallery={scrollToGallery} scrollToAbout={scrollToAbout} />
        </div>
      </header>
      
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : recipe ? (
          <article className={`${darkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/90 border-[#E9DFD8]'} backdrop-blur-sm rounded-xl shadow-md p-8 space-y-8 transition-colors duration-300 border`}>
            <div className="space-y-4">
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {recipe.title}
              </h1>
              <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} italic`}>
                {recipe.tagline}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.taxonomy.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant={darkMode ? "default" : "outline"} 
                    className={darkMode 
                      ? "bg-gray-700 hover:bg-gray-600 text-white" 
                      : "bg-[#F9F5F2] hover:bg-[#F3EBE6] text-gray-700 border border-[#E9DFD8]"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className={`flex justify-between items-center text-sm ${darkMode 
                ? 'text-gray-400 bg-gray-700/50 border-gray-600' 
                : 'text-gray-500 bg-[#F9F5F2] border-[#E9DFD8]'} mt-6 p-3 rounded-lg transition-colors duration-300 border`}>
                <div className="flex items-center gap-2">
                  <User size={16} className={darkMode ? "text-gray-300" : "text-gray-500"} />
                  <span>{recipe.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className={darkMode ? "text-gray-300" : "text-gray-500"} />
                  <span>{format(new Date(recipe.date), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div className={`prose-container ${darkMode 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white/95 border-[#E9DFD8]'} p-6 rounded-lg border`}>
              {renderRteContent(recipe.body)}
            </div>
          </article>
        ) : (
          <div className={`text-center py-12 ${darkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/90 border-[#E9DFD8]'} rounded-xl shadow-md border`}>
            <h2 className="text-2xl font-bold">Uppskriftin fannst ekki</h2>
            <Button 
              onClick={goBack} 
              className={`mt-4 ${darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-white text-gray-700 border-[#E9DFD8] hover:bg-[#F9F5F2]'}`}
            >
              <ArrowLeft className="mr-2" size={16} />
              Til baka
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
