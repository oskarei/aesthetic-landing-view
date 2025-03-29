
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Environment variables
const CONTENTSTACK_API_KEY = "bltaefe95bce3ee136b";
const CONTENTSTACK_DELIVERY_TOKEN = "csa457168b52b72939af51b9fd";
const CONTENTSTACK_ENVIRONMENT = "production";

// Create an error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.error('[GraphQL errors]:', graphQLErrors);
  }
  if (networkError) {
    console.error(`[Network error]:`, networkError);
  }
});

// Create the HTTP link to the Contentstack GraphQL endpoint
// Using EU endpoint as specified
const httpLink = createHttpLink({
  uri: `https://eu-graphql.contentstack.com/stacks/${CONTENTSTACK_API_KEY}?environment=${CONTENTSTACK_ENVIRONMENT}`,
  headers: {
    access_token: CONTENTSTACK_DELIVERY_TOKEN,
    'Content-Type': 'application/json',
  },
});

// Initialize Apollo Client with the combined links
const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
