
import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/types/recipe';
import { getRecipes, getMoreRecipes } from '@/data/recipeData';
import { useInView } from 'react-intersection-observer';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Initial load
  useEffect(() => {
    const loadInitialRecipes = async () => {
      try {
        setLoading(true);
        const data = await getRecipes();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load recipes');
        setLoading(false);
      }
    };

    loadInitialRecipes();
  }, []);

  // Load more when scrolling to bottom
  const loadMoreRecipes = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const moreRecipes = await getMoreRecipes(nextPage);
      
      if (moreRecipes.length === 0) {
        setHasMore(false);
      } else {
        setRecipes(prev => [...prev, ...moreRecipes]);
        setPage(nextPage);
      }
      
      // For demo purposes, limit to 3 pages
      if (nextPage >= 3) {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load more recipes');
    } finally {
      setLoading(false);
    }
  }, [loading, page]);

  // Trigger load more when in view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreRecipes();
    }
  }, [inView, hasMore, loading, loadMoreRecipes]);

  return { recipes, loading, error, hasMore, loadMoreRef: ref };
};
