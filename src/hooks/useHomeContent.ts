
import { gql, useQuery } from '@apollo/client';
import { useToast } from '@/components/ui/use-toast';

// GraphQL query to fetch the home content type
const HOME_QUERY = gql`
  query HomeContentQuery {
    all_home {
      items {
        title
      }
    }
  }
`;

export type HomeContent = {
  title: string;
};

// Default content for when API fails
const defaultHomeContent: HomeContent = {
  title: "Welcome to My Portfolio"
};

export const useHomeContent = () => {
  const { toast } = useToast();
  
  const { data, loading, error } = useQuery(HOME_QUERY, {
    onError: (error) => {
      console.error('Error fetching home content:', error);
      toast({
        title: "Connection error",
        description: "Could not connect to content API. Using default content.",
        variant: "destructive"
      });
    },
    // In case of error, don't retry indefinitely
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  
  // Use real content if available, otherwise fallback to default
  const homeContent: HomeContent = data?.all_home?.items?.[0] || defaultHomeContent;
  
  return { homeContent, loading, error };
};
