import '@getpara/react-sdk/styles.css'
import { Head } from 'components/common/Head/Head'
import { LanguageProvider } from 'contexts/Language/LanguageProvider'
import ParaProviders from 'contexts/Para/Providers'
import SupabaseSessionProvider from 'contexts/SupabaseSession/SupabaseSessionProvider'
import { getInitialThemeOption, syncTheme } from 'contexts/Theme/useJuiceTheme'
import { useFathom } from 'lib/fathom'
import type { AppProps } from 'next/app'
import '../styles/index.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  syncTheme(getInitialThemeOption())
  useFathom()

  if (!pageProps.i18n) {
    console.error(
      'Missing i18n prop - please ensure that page has globalGetServerSideProps',
    )
  }

  return (
    <LanguageProvider i18n={pageProps.i18n}>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <ParaProviders>
        <SupabaseSessionProvider initialSession={pageProps.initialSession}>
          <Component {...pageProps} />
        </SupabaseSessionProvider>
      </ParaProviders>
    </LanguageProvider>
  )
}
