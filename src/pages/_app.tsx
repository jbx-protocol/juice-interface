import { Head } from 'components/common'
import { LanguageProvider } from 'contexts/Language/LanguageProvider'
import SupabaseSessionProvider from 'contexts/SupabaseSession/SupabaseSessionProvider'
import type { AppProps } from 'next/app'
import '../styles/index.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  if (!pageProps.i18n) {
    console.error(
      'Missing i18n prop - please ensure that page has globalGetServerSideProps',
    )
  }

  return (
    <LanguageProvider i18n={pageProps.i18n}>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <SupabaseSessionProvider initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SupabaseSessionProvider>
    </LanguageProvider>
  )
}
