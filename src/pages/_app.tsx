import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import "./_app.css";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#fff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default App;
