import Onboard from 'bnc-onboard'
import { Subscriptions } from 'bnc-onboard/dist/src/interfaces'

import { readNetwork } from 'constants/networks'

const appName = 'Juicebox'
const networkId = readNetwork.chainId
const rpcUrl = readNetwork.rpcUrl
const dappId = process.env.NEXT_PUBLIC_BLOCKNATIVE_API_KEY

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
          appUrl: 'https://juicebox.money/#/',
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
