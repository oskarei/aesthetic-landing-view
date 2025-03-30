
import { gql, useQuery } from '@apollo/client';
import { Recipe } from '@/types/recipe';
import { createRecipeSlug } from '@/lib/slugify';

// GraphQL query to fetch recipes
export const RECIPES_QUERY = gql`
  query RecipesQuery($skip: Int, $limit: Int) {
    all_recipe(locale: "is-is", skip: $skip, limit: $limit, sort: { date: -1 }) {
      items {
        title
        tagline
        author
        date
        body {
          json
        }
        taxonomy {
          name
          values {
            name
            value
          }
        }
        image {
          url
          description
        }
        uid
      }
    }
  }
`;

// Query for a single recipe by uid
export const RECIPE_BY_UID_QUERY = gql`
  query RecipeByUidQuery($uid: String!) {
    recipe(uid: $uid, locale: "is-is") {
      title
      tagline
      author
      date
      body {
        json
      }
      taxonomy {
        name
        values {
          name
          value
        }
      }
      image {
        url
        description
      }
      uid
    }
  }
`;

// Transform Contentstack recipe to our app's Recipe format
const transformRecipe = (item: any): Recipe => {
  // Extract taxonomy values from the complex structure
  const taxonomyTerms = item.taxonomy?.flatMap((tax: any) => 
    tax.values?.map((val: any) => val.value || val.name) || []
  ) || [];

  return {
    id: item.uid,
    title: item.title || '',
    tagline: item.tagline || '',
    author: item.author || 'Ótilgreindur höfundur',
    date: item.date || new Date().toISOString(),
    body: item.body?.json ? JSON.stringify(item.body.json) : '', // Store JSON as string for now
    taxonomy: taxonomyTerms,
    image: item.image?.url || '/placeholder.svg',
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

  const hasMore = data?.all_recipe?.items.length >= limit;

  return { recipes, loading, error, loadMore, hasMore };
};

export const useContentstackRecipeByUid = (uid: string) => {
  const { data, loading, error } = useQuery(RECIPE_BY_UID_QUERY, {
    variables: { uid },
    skip: !uid
  });
  
  const recipe = data?.recipe ? transformRecipe(data.recipe) : null;
  
  return { recipe, loading, error };
};
