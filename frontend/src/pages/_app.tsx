import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pawsome Meals</title>
        <meta name="description" content="Personalized dog food subscription service" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SubscriptionProvider>
        <Component {...pageProps} />
      </SubscriptionProvider>
    </>
  );
}
