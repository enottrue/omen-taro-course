import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo/apollo';
import { MainContextProvider } from '@/contexts/MainContext';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { YandexMetricaProvider } from 'next-yandex-metrica';
import { useRouter } from 'next/router';

import UtmInitializer from '@/components/UtmInitializer';
import AuthStatusTooltip from '@/components/AuthStatusTooltip';
import LogoutButton from '@/components/LogoutButton';
import DevelopmentStyles from '@/components/DevelopmentStyles';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <YandexMetricaProvider
      router={router as any}
      tagID={100786060}
      initParameters={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      }}
    >
      <ApolloProvider client={apolloClient}>
        <MainContextProvider>
          <>
            <UtmInitializer />
            <DevelopmentStyles />
            {/* <AuthStatusTooltip /> */}
            {/* <LogoutButton /> */}
            <Component {...pageProps} />
          </>
        </MainContextProvider>
      </ApolloProvider>
    </YandexMetricaProvider>
  );
}
