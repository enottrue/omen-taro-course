import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  NormalizedCacheObject,
} from '@apollo/client';
import dotenv from 'dotenv';
dotenv.config();

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

// Используем абсолютный URL на сервере и относительный в браузере
const uri = typeof window === 'undefined'
  ? process.env.NEXT_PUBLIC_GRAPHQL_API_URL
  : '/api/graphql';

console.log('Apollo GraphQL endpoint:', uri);

export const apolloClient = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default apolloClient;
