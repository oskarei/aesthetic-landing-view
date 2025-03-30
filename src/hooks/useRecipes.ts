
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useContentstackRecipes } from './useContentstackRecipes';

export const useRecipes = () => {
  const { recipes, loading, error, loadMore, hasMore } = useContentstackRecipes(0, 5);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  return { recipes, loading, error: error ? 'Failed to load recipes' : null, hasMore, loadMoreRef: ref };
};
