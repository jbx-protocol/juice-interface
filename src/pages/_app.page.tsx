import type { AppProps } from 'next/app'
import React from 'react'
import { Head } from 'components/common'
import injectedModule from '@web3-onboard/injected-wallets'

import '../styles/antd.css'
import '../styles/index.scss'
import { BigNumber } from '@ethersproject/bignumber'
import { init } from '@web3-onboard/react'
import { unpadLeadingZerosString } from 'utils/bigNumbers'

import { NETWORKS } from 'constants/networks'

const injected = injectedModule()

init({
  wallets: [injected],
  chains: Object.values(NETWORKS).map(n => ({
    id: unpadLeadingZerosString(BigNumber.from(n.chainId).toHexString()),
    rpcUrl: n.rpcUrl,
    token: n.token ?? 'ETH',
    label: n.label,
  })),
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <Component {...pageProps} />
    </>
  )
}
