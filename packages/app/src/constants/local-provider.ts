import { JsonRpcProvider } from '@ethersproject/providers'

import { NetworkName } from '../models/network-name'
import { NETWORKS } from './networks'

const networkName: NetworkName =
  process.env.NODE_ENV === 'production'
    ? (process.env.REACT_APP_INFURA_NETWORK as NetworkName) ||
      NetworkName.mainnet
    : (process.env.REACT_APP_INFURA_DEV_NETWORK as NetworkName) ||
      NetworkName.localhost

export const localProvider = new JsonRpcProvider(NETWORKS[networkName].rpcUrl)
