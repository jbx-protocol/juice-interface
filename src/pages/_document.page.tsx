import { abortableFetch } from 'abortcontroller-polyfill/dist/cjs-ponyfill'
import { Head, Html, Main, NextScript } from 'next/document'
import fetch from 'node-fetch'

global.fetch = abortableFetch(fetch).fetch

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
