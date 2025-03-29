
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
        description {
          json
          # Add any other necessary fields for the rich text editor
        }
        contact_button
        location
        email
        backgroundConnection {
          edges {
            node {
              url
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
  description?: any; // JSON RTE field
  contact_button?: string[];
  location?: string;
  email?: string;
  backgroundConnection?: {
    edges: Array<{
      node: {
        url: string;
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
  
  // Adding console logs for debugging
  console.log("Contentstack data received:", data);
  console.log("Description field:", homeContent?.description);
  
  return { homeContent, loading, error };
};
