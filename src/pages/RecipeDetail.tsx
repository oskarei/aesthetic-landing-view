
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md">
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800'} transition-colors duration-300`}>
      <header className={`p-6 flex justify-between sticky top-0 z-20 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur border-b border-gray-200 shadow-sm transition-colors duration-300`}>
        <Button 
          variant="outline" 
          onClick={goBack} 
          className={`flex items-center gap-2 ${darkMode ? 'hover:bg-gray-800 border-gray-700' : 'hover:bg-gray-100'} transition-colors`}
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
          <article className={`${darkMode ? 'bg-gray-800/70' : 'bg-white/80'} backdrop-blur-sm rounded-xl shadow-md p-8 space-y-8 transition-colors duration-300`}>
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
                    className={darkMode ? 
                      "bg-gray-700 hover:bg-gray-600 text-white" : 
                      "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400 bg-gray-700/50' : 'text-gray-500 bg-gray-50'} mt-6 p-3 rounded-lg transition-colors duration-300`}>
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
            
            <div className={`prose-container ${darkMode ? 'bg-gray-800/50' : 'bg-white'} p-6 rounded-lg`}>
              {renderRteContent(recipe.body)}
            </div>
          </article>
        ) : (
          <div className={`text-center py-12 ${darkMode ? 'bg-gray-800/70' : 'bg-white'} rounded-xl shadow-md`}>
            <h2 className="text-2xl font-bold">Uppskriftin fannst ekki</h2>
            <Button onClick={goBack} className="mt-4">
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
