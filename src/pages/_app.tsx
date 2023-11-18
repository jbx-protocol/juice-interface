import { Head } from 'components/common/Head/Head'
import { LanguageProvider } from 'contexts/Language/LanguageProvider'
import SupabaseSessionProvider from 'contexts/SupabaseSession/SupabaseSessionProvider'
import { initWeb3Onboard, useInitWallet } from 'hooks/Wallet'
import { useFathom } from 'lib/fathom'
import type { AppProps } from 'next/app'
import '../styles/index.scss'

/**
 * Init Web3 Onboard
 *
 * Must be called outside component scope, to ensure it is called before component lifecycle starts and hooks execute.
 */
initWeb3Onboard()

export default function MyApp({ Component, pageProps }: AppProps) {
  // Currently, init() must be called *here* (as opposed to AppWrapper), or else it breaks when navigating between pages.
  useInitWallet()
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
      <SupabaseSessionProvider initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SupabaseSessionProvider>
    </LanguageProvider>
  )
}
