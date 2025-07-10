import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/apollo';
import { MainContextProvider } from '@/contexts/MainContext';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { YandexMetricaProvider } from 'next-yandex-metrica';
import UtmInitializer from '@/components/UtmInitializer';
import AuthStatusTooltip from '@/components/AuthStatusTooltip';
import LogoutButton from '@/components/LogoutButton';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <MainContextProvider>
        <>
          <UtmInitializer />
          <AuthStatusTooltip />
          <LogoutButton />
          <YandexMetricaProvider
            tagID={96059996}
            initParameters={{
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
            }}
          >
            <Component {...pageProps} />
          </YandexMetricaProvider>
        </>
      </MainContextProvider>
    </ApolloProvider>
  );
}
