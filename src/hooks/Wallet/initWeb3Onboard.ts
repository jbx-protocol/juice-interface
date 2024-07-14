import coinbaseWalletModule from '@web3-onboard/coinbase'
import Onboard from '@web3-onboard/core'
import safeModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import config from 'config/seo_meta.json'
import { NETWORKS, readNetwork } from 'constants/networks'
import { BigNumber } from 'ethers'
import { unpadLeadingZerosString } from 'utils/bigNumbers'

export function initWeb3Onboard() {
  const injected = injectedModule()
  const safe = safeModule()
  const coinbaseWalletSdk = coinbaseWalletModule()
  const walletConnect = walletConnectModule({
    dappUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://juicebox.money',
    version: 2,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    requiredChains: [readNetwork.chainId],
  })

  return Onboard({
    wallets: [injected, safe, walletConnect, coinbaseWalletSdk],
    chains: Object.values(NETWORKS).map(n => ({
      id: unpadLeadingZerosString(BigNumber.from(n.chainId).toHexString()),
      rpcUrl: n.rpcUrl,
      token: n.token ?? 'ETH',
      label: n.label,
    })),
    appMetadata: {
      logo: '/assets/juice-logo-full_black.svg',
      name: config.title,
      description: config.description,
    },
    connect: {
      autoConnectLastWallet: true,
    },
    accountCenter: {
      mobile: {
        enabled: false,
      },
      desktop: {
        enabled: false,
      },
    },
  })
}
