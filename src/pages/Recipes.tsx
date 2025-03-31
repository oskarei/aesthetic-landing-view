
import React from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/recipes/RecipeCard';
import { Skeleton } from '@/components/ui/skeleton';
import HamburgerMenu from '@/components/HamburgerMenu';

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

  // Create empty scroll functions as placeholders that match the HamburgerMenu props
  const scrollToGallery = () => {};
  const scrollToAbout = () => {};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-6 flex justify-end sticky top-0 z-20">
        <HamburgerMenu scrollToGallery={scrollToGallery} scrollToAbout={scrollToAbout} />
      </header>
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Uppskriftir</h1>
        
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
            <p className="text-center text-gray-500 my-8">Engar fleiri uppskriftir</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
