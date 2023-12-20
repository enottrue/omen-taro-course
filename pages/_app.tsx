import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/apollo';
import { MainContextProvider } from '@/contexts/MainContext';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <MainContextProvider>
        <>
          <Component {...pageProps} />
        </>
      </MainContextProvider>
    </ApolloProvider>
  );
}
