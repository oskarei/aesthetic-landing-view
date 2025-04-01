
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeBySlug } from '@/hooks/useRecipeBySlug';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import HamburgerMenu from '@/components/HamburgerMenu';
import { jsonToHtml } from '@contentstack/json-rte-serializer';

const LoadingSkeleton = () => (
  <div className="space-y-6">
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
        '<img$1 style="max-width: 150px; height: auto; border-radius: 8px; margin: 1rem 0;" class="shadow-md">'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Villa kom upp</h1>
          <p className="mt-2">Uppskriftin fannst ekki.</p>
          <Button onClick={goBack} className="mt-4">
            <ArrowLeft className="mr-2" size={16} />
            Til baka
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="p-6 flex justify-between sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <Button 
          variant="outline" 
          onClick={goBack} 
          className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={16} />
          Til baka
        </Button>
        <HamburgerMenu scrollToGallery={scrollToGallery} scrollToAbout={scrollToAbout} />
      </header>
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : recipe ? (
          <article className="bg-white rounded-xl shadow-md p-8 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-gray-800">{recipe.title}</h1>
              <p className="text-xl text-muted-foreground italic">{recipe.tagline}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.taxonomy.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span>{recipe.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>{format(new Date(recipe.date), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div className="prose-container bg-white p-4 rounded-lg">
              {renderRteContent(recipe.body)}
            </div>
          </article>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
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
