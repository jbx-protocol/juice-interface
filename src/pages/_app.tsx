import '@getpara/react-sdk-lite/styles.css'
import { Head } from 'components/common/Head/Head'
import { LanguageProvider } from 'contexts/Language/LanguageProvider'
import ParaProviders from 'contexts/Para/Providers'
import ReactQueryProvider from 'contexts/ReactQueryProvider'
import SupabaseSessionProvider from 'contexts/SupabaseSession/SupabaseSessionProvider'
import { ThemeProvider } from 'contexts/Theme/ThemeProvider'
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
      {/* Moving ThemeProvider up so Para can react to the theme changes and update modal*/}
      <ThemeProvider>
        <ReactQueryProvider>
          <ParaProviders>
            <SupabaseSessionProvider initialSession={pageProps.initialSession}>
              <Component {...pageProps} />
            </SupabaseSessionProvider>
          </ParaProviders>
        </ReactQueryProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
