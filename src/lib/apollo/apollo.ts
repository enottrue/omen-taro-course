import { ApolloClient, InMemoryCache, DefaultOptions } from '@apollo/client';

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

export const apolloClient = new ApolloClient({
  uri: 'https://omen-taro.ru/api/graphql',
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default apolloClient;
