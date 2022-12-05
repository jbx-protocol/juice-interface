import { AppWrapper, Head, NextPageWithLayout } from 'components/common'
import type { AppProps } from 'next/app'
import React from 'react'
import ErrorBoundary from 'components/common/ErrorBoundry'
import '../styles/globals.css'

import '../styles/antd.css'
import '../styles/index.scss'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? AppWrapper

  return (
    <ErrorBoundary>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
}
