import { JsonRpcProvider } from '@ethersproject/providers'
import { NetworkName } from '../models/network-name'

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = 'http://localhost:8545'

const localProviderUrlFromEnv =
  process.env.REACT_APP_DEV_NETWORK !== NetworkName.local
    ? `https://${process.env.REACT_APP_DEV_NETWORK}.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
    : localProviderUrl

export const localProvider = new JsonRpcProvider(localProviderUrlFromEnv)
