import Onboard from 'bnc-onboard'
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces'
import { chain, configureChains, createClient } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import {
  connectorsForWallets,
  getDefaultWallets,
  wallet,
} from '@rainbow-me/rainbowkit'
import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

const appName = 'Juicebox'
const networkId = readNetwork.chainId
const rpcUrl = readNetwork.rpcUrl
const dappId = process.env.NEXT_PUBLIC_BLOCKNATIVE_API_KEY

// TODO

const { chains, provider, webSocketProvider } = configureChains(
  [readNetwork.name === NetworkName.mainnet ? chain.mainnet : chain.rinkeby],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
    publicProvider(),
  ],
)

const appInfo = { appName }

export const { wallets } = getDefaultWallets({
  appName,
  chains,
})

export const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      wallet.argent({ chains }),
      wallet.trust({ chains }),
      wallet.ledger({ chains }),
    ],
  },
])

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider: provider,
  webSocketProvider: webSocketProvider,
})

// TODO(odd-amphora): Add support for Formatic, Portis, etc. if requested.
export function initOnboard(subscriptions: Subscriptions, darkMode: boolean) {
  return Onboard({
    dappId,
    hideBranding: true,
    networkId,
    darkMode,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: 'metamask' },
        {
          walletName: 'trezor',
          appUrl: 'https://juicebox.money/',
          email: 'me.jango@protonmail.com',
          rpcUrl,
        },
        {
          walletName: 'ledger',
          rpcUrl,
        },
        {
          walletName: 'walletConnect',
          infuraKey: `${process.env.NEXT_PUBLIC_INFURA_ID}`,
        },
        { walletName: 'coinbase' },
        { walletName: 'status' },
        { walletName: 'walletLink', rpcUrl },
        { walletName: 'gnosis' },
        { walletName: 'keystone', appName: 'React Demo', rpcUrl },
        {
          walletName: 'lattice',
          appName,
          rpcUrl,
        },
        { walletName: 'trust', rpcUrl },
        { walletName: 'opera' },
        { walletName: 'operaTouch' },
        { walletName: 'imToken', rpcUrl },
        { walletName: 'meetone' },
        { walletName: 'tally' },
        { walletName: 'authereum', disableNotifications: true },
      ],
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
    ],
  })
}

export { chains, appInfo }
