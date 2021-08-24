import Notify from 'bnc-notify'
import Onboard from 'bnc-onboard'
import { readNetwork } from 'constants/networks'

const appName = 'Juicebox'
const networkId = readNetwork.chainId
const rpcUrl = readNetwork.rpcUrl
const dappId = process.env.REACT_APP_BLOCKNATIVE_API_KEY

export function initOnboard(subscriptions, darkMode) {
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
          appUrl: 'https://reactdemo.blocknative.com',
          email: 'aaron@blocknative.com',
          rpcUrl,
        },
        {
          walletName: 'ledger',
          rpcUrl,
        },
        {
          walletName: 'walletConnect',
          infuraKey: `${process.env.REACT_APP_INFURA_ID}`,
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
        { walletName: 'authereum', disableNotifications: true },
        // TODO(odd-amphora): Set up fortmatic.
        // { walletName: 'fortmatic', apiKey: 'pk_test_886ADCAB855632AA' },
        // TODO(odd-amphora): Set up Portis.
        // {
        //   walletName: 'portis',
        //   apiKey: 'b2b7586f-2b1e-4c30-a7fb-c2d1533b153b'
        // },
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

export function initNotify() {
  return Notify({
    dappId,
    networkId,
    onerror: error => console.log(`Notify error: ${error.message}`),
  })
}
