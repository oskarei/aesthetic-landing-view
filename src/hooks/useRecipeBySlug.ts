
import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { createRecipeSlug } from '@/lib/slugify';
import { getRecipes } from '@/data/recipeData';

export const useRecipeBySlug = (slug: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        // Get all recipes and find the one with the matching slug
        const allRecipes = await getRecipes();
        
        // Find the recipe with matching slug or create a slug from title to match
        const foundRecipe = allRecipes.find(
          (r) => createRecipeSlug(r.title) === slug
        );
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRecipe();
    }
  }, [slug]);

  return { recipe, loading, error };
};
