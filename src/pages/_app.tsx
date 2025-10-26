import { SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '@/context/AuthContext';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}

export default appWithTranslation(App);