
import React, { useState } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import RecipeCard from '@/components/recipes/RecipeCard';
import { Skeleton } from '@/components/ui/skeleton';
import HamburgerMenu from '@/components/HamburgerMenu';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const LoadingSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-xl p-6 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[300px]" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
    <Skeleton className="h-[100px] w-full" />
  </div>
);

const RecipesPage = () => {
  const { recipes, loading, hasMore, loadMoreRef } = useRecipes();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // These functions will now navigate to the home page with instructions to scroll
  const scrollToGallery = () => {
    navigate('/', { state: { scrollTarget: 'gallery' } });
  };
  
  const scrollToAbout = () => {
    navigate('/', { state: { scrollTarget: 'about' } });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800'} transition-colors duration-300`}>
      <header className={`p-6 flex justify-between sticky top-0 z-20 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur border-b border-gray-200 shadow-sm transition-colors duration-300`}>
        <h1 className="text-2xl font-bold">Uppskriftir</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <HamburgerMenu scrollToGallery={scrollToGallery} scrollToAbout={scrollToAbout} />
        </div>
      </header>
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className={`${darkMode ? 'bg-gray-800/70' : 'bg-white/80'} backdrop-blur-sm shadow-md rounded-xl p-6 mb-8 transition-colors duration-300`}>
          <h1 className={`text-3xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Uppskriftir
          </h1>
          <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Skoðaðu nýjustu uppskriftirnar okkar
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-gray-300 to-gray-400 mx-auto rounded-full mt-4"></div>
        </div>
        
        <div className="space-y-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
          
          {/* Loading more indicator */}
          {loading && (
            <div className="space-y-6 mt-6">
              {[1, 2].map((i) => (
                <LoadingSkeleton key={`skeleton-${i}`} />
              ))}
            </div>
          )}
          
          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
              {loading && (
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Hleð inn fleiri uppskriftum...
                </p>
              )}
            </div>
          )}
          
          {!hasMore && recipes.length > 0 && (
            <p className={`text-center ${darkMode ? 'text-gray-400 bg-gray-800/50' : 'text-gray-500 bg-white'} my-8 p-4 rounded-lg shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              Engar fleiri uppskriftir
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;
