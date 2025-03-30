
import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { createRecipeSlug } from '@/lib/slugify';
import { gql, useQuery } from '@apollo/client';

// GraphQL query to fetch recipes by slug (indirectly through title)
const RECIPE_BY_SLUG_QUERY = gql`
  query RecipeBySlugQuery {
    all_recipe(locale: "is-is") {
      items {
        title
        tagline
        author
        date
        body {
          json
        }
        url
      }
    }
  }
`;

// Transform Contentstack recipe to our app's Recipe format
const transformRecipe = (item: any): Recipe => {
  return {
    id: item.url || '',
    title: item.title || '',
    tagline: item.tagline || '',
    author: item.author || 'Ótilgreindur höfundur',
    date: item.date || new Date().toISOString(),
    body: item.body?.json ? JSON.stringify(item.body.json) : '',
    taxonomy: [], // Empty array since we're skipping taxonomy for now
    image: '/placeholder.svg', // Using placeholder as image field was not in the schema
    slug: createRecipeSlug(item.title)
  };
};

export const useRecipeBySlug = (slug: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { data, loading: queryLoading, error: queryError } = useQuery(RECIPE_BY_SLUG_QUERY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryLoading) {
      setLoading(true);
      return;
    }

    if (queryError) {
      setError('Failed to fetch recipes');
      setLoading(false);
      return;
    }

    if (data && slug) {
      // Find the recipe with matching slug (derived from title)
      const items = data.all_recipe?.items || [];
      const foundItem = items.find((item: any) => 
        createRecipeSlug(item.title) === slug
      );
      
      if (foundItem) {
        setRecipe(transformRecipe(foundItem));
      } else {
        setError('Recipe not found');
      }
      
      setLoading(false);
    }
  }, [data, queryLoading, queryError, slug]);

  return { recipe, loading, error };
};
