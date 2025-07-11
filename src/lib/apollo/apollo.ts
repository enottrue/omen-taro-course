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

console.log(process.env.APOLLO_DEV_ENVIRONTMENT);

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:3001/api/graphql', // Локальная разработка
  // uri: 'https://omen-taro.ru/api/graphql', // Продакшн
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default apolloClient;
