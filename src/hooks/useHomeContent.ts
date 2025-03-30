
import { gql, useQuery } from '@apollo/client';

// GraphQL query to fetch the home content type
const HOME_QUERY = gql`
  query HomeContentQuery {
    all_home {
      items {
        title
        header
        subheader
        bio
        contact_button
        location
        email
        backgroundConnection {
          edges {
            node {
              url
              description
            }
          }
        }
      }
    }
  }
`;

export type HomeContent = {
  title: string;
  header: string;
  subheader: string;
  bio: string;
  contact_button?: string[];
  location?: string;
  email?: string;
  backgroundConnection?: {
    edges: Array<{
      node: {
        url: string;
        description?: string;
      };
    }>;
  };
};

export const useHomeContent = () => {
  const { data, loading, error } = useQuery(HOME_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  
  const homeContent: HomeContent | undefined = data?.all_home?.items?.[0];
  
  return { homeContent, loading, error };
};
