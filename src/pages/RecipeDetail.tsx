
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipeBySlug } from '@/hooks/useRecipeBySlug';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import HamburgerMenu from '@/components/HamburgerMenu';

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
    <Skeleton className="h-[300px] w-full" />
  </div>
);

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { recipe, loading, error } = useRecipeBySlug(slug || '');

  // Create empty scroll functions as placeholders that match the HamburgerMenu props
  const scrollToGallery = () => {};
  const scrollToAbout = () => {};

  const goBack = () => {
    navigate(-1);
  };

  // Function to render RTE content
  const renderRteContent = (bodyContent: string) => {
    try {
      // Try to parse the JSON string
      const contentJson = JSON.parse(bodyContent);
      
      // Simple renderer for JSON RTE content
      // This is a basic implementation - could be expanded based on the actual structure
      return (
        <div className="prose max-w-none">
          {Array.isArray(contentJson) ? 
            contentJson.map((block: any, idx: number) => {
              if (block.type === 'paragraph') {
                return <p key={idx}>{block.children?.map((child: any) => child.text).join('')}</p>;
              } else if (block.type === 'heading-one') {
                return <h1 key={idx}>{block.children?.map((child: any) => child.text).join('')}</h1>;
              } else if (block.type === 'heading-two') {
                return <h2 key={idx}>{block.children?.map((child: any) => child.text).join('')}</h2>;
              } else if (block.type === 'heading-three') {
                return <h3 key={idx}>{block.children?.map((child: any) => child.text).join('')}</h3>;
              } else if (block.type === 'list-item') {
                return <li key={idx}>{block.children?.map((child: any) => child.text).join('')}</li>;
              } else if (block.type === 'bulleted-list') {
                return <ul key={idx}>{block.children?.map((child: any, i: number) => 
                  <li key={i}>{child.children?.map((c: any) => c.text).join('')}</li>)}</ul>;
              } else {
                return <div key={idx}>{JSON.stringify(block)}</div>;
              }
            }) :
            <p>{bodyContent}</p>
          }
        </div>
      );
    } catch (e) {
      // Fallback to display as plain text if not valid JSON
      return (
        <div className="prose max-w-none">
          {bodyContent.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "text-lg font-medium" : ""}>
              {paragraph.replace(/^#{1,6}\s+/, '')}
            </p>
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
    <div className="min-h-screen bg-gray-50">
      <header className="p-6 flex justify-between sticky top-0 z-20">
        <Button 
          variant="outline" 
          onClick={goBack} 
          className="flex items-center gap-2"
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
          <article className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-3">{recipe.title}</h1>
              <p className="text-xl text-muted-foreground italic">{recipe.tagline}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.taxonomy.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground mt-6">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{recipe.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{format(new Date(recipe.date), 'MMMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[300px] bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {renderRteContent(recipe.body)}
          </article>
        ) : (
          <div className="text-center py-12">
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
