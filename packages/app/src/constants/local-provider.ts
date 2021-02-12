import { JsonRpcProvider } from '@ethersproject/providers'

import { NetworkName } from '../models/network-name'

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = 'http://localhost:8545'

export const localProvider = new JsonRpcProvider(
  process.env.NODE_ENV !== 'production'
    ? `https://${NetworkName.mainnet}.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
    : localProviderUrl,
)
