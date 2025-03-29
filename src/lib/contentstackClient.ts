
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Environment variables
const CONTENTSTACK_API_KEY = "bltaefe95bce3ee136b";
const CONTENTSTACK_DELIVERY_TOKEN = "csa457168b52b72939af51b9fd";
const CONTENTSTACK_ENVIRONMENT = "production";

// Create an error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create the HTTP link to the Contentstack GraphQL endpoint
const httpLink = createHttpLink({
  uri: `https://eu-graphql.contentstack.com/`,
  headers: {
    api_key: CONTENTSTACK_API_KEY,
    access_token: CONTENTSTACK_DELIVERY_TOKEN,
    environment: CONTENTSTACK_ENVIRONMENT,
    'Content-Type': 'application/json',
  },
  // Add fetch options to handle CORS
  fetchOptions: {
    mode: 'cors',
    credentials: 'same-origin'
  }
});

// Initialize Apollo Client with the combined links
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache()
});

export default client;
