import { Head } from 'components/common'
import SupabaseSessionProvider from 'contexts/SupabaseSession/SupabaseSessionProvider'
import type { AppProps } from 'next/app'
import '../styles/index.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <SupabaseSessionProvider initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SupabaseSessionProvider>
    </>
  )
}
