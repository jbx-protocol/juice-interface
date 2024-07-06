import { Web3OnboardProvider } from '@web3-onboard/react'
import { Head } from 'components/common/Head/Head'
import { LanguageProvider } from 'contexts/Language/LanguageProvider'
import SupabaseSessionProvider from 'contexts/SupabaseSession/SupabaseSessionProvider'
import { initWeb3Onboard } from 'hooks/Wallet/initWeb3Onboard'
import { useFathom } from 'lib/fathom'
import type { AppProps } from 'next/app'
import '../styles/index.scss'

/**
 * Init Web3 Onboard
 *
 * Must be called outside component scope, to ensure it is called before component lifecycle starts and hooks execute.
 */
const web3Onboard = initWeb3Onboard()

export default function MyApp({ Component, pageProps }: AppProps) {
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
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <SupabaseSessionProvider initialSession={pageProps.initialSession}>
          <Component {...pageProps} />
        </SupabaseSessionProvider>
      </Web3OnboardProvider>
    </LanguageProvider>
  )
}
