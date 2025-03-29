
import { gql, useQuery } from '@apollo/client';

// GraphQL query to fetch the home content type
const HOME_QUERY = gql`
  query GetHomeContent {
    all_home {
      items {
        title
        system {
          uid
        }
      }
    }
  }
`;

export type HomeContent = {
  title: string;
  system: {
    uid: string;
  };
};

export const useHomeContent = () => {
  const { data, loading, error } = useQuery(HOME_QUERY);
  
  const homeContent: HomeContent | null = data?.all_home?.items?.[0] || null;
  
  return { homeContent, loading, error };
};
