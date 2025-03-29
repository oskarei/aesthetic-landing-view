
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Environment variables
const CONTENTSTACK_API_KEY = "bltaefe95bce3ee136b";
const CONTENTSTACK_DELIVERY_TOKEN = "csa457168b52b72939af51b9fd";
const CONTENTSTACK_ENVIRONMENT = "production";

// Create the HTTP link to the Contentstack GraphQL endpoint
const httpLink = createHttpLink({
  uri: `https://eu-graphql.contentstack.com/`,
  headers: {
    api_key: CONTENTSTACK_API_KEY,
    access_token: CONTENTSTACK_DELIVERY_TOKEN,
    environment: CONTENTSTACK_ENVIRONMENT,
  }
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;
