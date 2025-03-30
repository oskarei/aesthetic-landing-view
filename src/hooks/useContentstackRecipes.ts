
import { gql, useQuery } from '@apollo/client';
import { Recipe } from '@/types/recipe';
import { createRecipeSlug } from '@/lib/slugify';

// GraphQL query to fetch recipes - updated to match Contentstack schema
export const RECIPES_QUERY = gql`
  query RecipesQuery($skip: Int, $limit: Int) {
    all_recipe(locale: "is-is", skip: $skip, limit: $limit) {
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

// Query for a single recipe by url
export const RECIPE_BY_URL_QUERY = gql`
  query RecipeByUrlQuery($url: String!) {
    recipe(url: $url, locale: "is-is") {
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

export const useContentstackRecipes = (skip: number = 0, limit: number = 5) => {
  const { data, loading, error, fetchMore } = useQuery(RECIPES_QUERY, {
    variables: { skip, limit },
    notifyOnNetworkStatusChange: true,
  });

  const recipes: Recipe[] = data?.all_recipe?.items.map(transformRecipe) || [];
  
  const loadMore = () => {
    fetchMore({
      variables: {
        skip: recipes.length,
        limit
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          all_recipe: {
            ...prev.all_recipe,
            items: [...prev.all_recipe.items, ...fetchMoreResult.all_recipe.items]
          }
        };
      }
    });
  };

  // Consider all fetched recipes as the full set if less than limit
  const hasMore = data?.all_recipe?.items.length >= limit;

  return { recipes, loading, error, loadMore, hasMore };
};

export const useContentstackRecipeByUrl = (url: string) => {
  const { data, loading, error } = useQuery(RECIPE_BY_URL_QUERY, {
    variables: { url },
    skip: !url
  });
  
  const recipe = data?.recipe ? transformRecipe(data.recipe) : null;
  
  return { recipe, loading, error };
};
