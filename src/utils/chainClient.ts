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

const { chains, provider, webSocketProvider } = configureChains(
  [readNetwork.name === NetworkName.mainnet ? chain.mainnet : chain.rinkeby],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
    publicProvider(),
  ],
)

const appInfo = { appName }

const { wallets } = getDefaultWallets({
  appName,
  chains,
})

const connectors = connectorsForWallets([
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

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider: provider,
  webSocketProvider: webSocketProvider,
})

export { chains, appInfo, wagmiClient }
