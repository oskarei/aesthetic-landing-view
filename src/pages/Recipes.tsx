
import React from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/recipes/RecipeCard';
import { Skeleton } from '@/components/ui/skeleton';
import HamburgerMenu from '@/components/HamburgerMenu';
import { useNavigate } from 'react-router-dom';

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[300px]" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
    <Skeleton className="h-[200px] w-full" />
  </div>
);

const RecipesPage = () => {
  const { recipes, loading, hasMore, loadMoreRef } = useRecipes();
  const navigate = useNavigate();

  // These functions will now navigate to the home page with instructions to scroll
  const scrollToGallery = () => {
    navigate('/', { state: { scrollTarget: 'gallery' } });
  };
  
  const scrollToAbout = () => {
    navigate('/', { state: { scrollTarget: 'about' } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="p-6 flex justify-end sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <HamburgerMenu scrollToGallery={scrollToGallery} scrollToAbout={scrollToAbout} />
      </header>
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h1 className="text-4xl font-bold mb-3 text-center text-gray-800">Uppskriftir</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-gray-200 to-gray-300 mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
          
          {/* Loading more indicator */}
          {loading && (
            <div className="space-y-8 mt-8">
              {[1, 2].map((i) => (
                <LoadingSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}
          
          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
              {loading && <p className="text-gray-500">Hleð inn fleiri uppskriftum...</p>}
            </div>
          )}
          
          {!hasMore && recipes.length > 0 && (
            <p className="text-center text-gray-500 my-8 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              Engar fleiri uppskriftir
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
