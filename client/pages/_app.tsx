import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { MoralisProvider } from "react-moralis"

import type { AppProps } from "next/app"
import Head from "next/head"

import { NotificationProvider } from "@web3uikit/core"

import Header from "@/components/Header"

import "@/styles/globals.css"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/47470/ethereal-gallery/version/latest",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <NotificationProvider>
          <Head>
            <title>Ethereal Gallery</title>
            <meta name="description" content="Ethereal Gallery" />
          </Head>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </ApolloProvider>
    </MoralisProvider>
  )
}
