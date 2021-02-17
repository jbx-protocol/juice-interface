import { JsonRpcProvider } from '@ethersproject/providers'

import { NetworkName } from '../models/network-name'
import { NETWORKS } from './networks'

const targetNetwork =
  NETWORKS[
    (process.env.REACT_APP_INFURA_NETWORK as NetworkName) ||
      NetworkName.localhost
  ]

const localProviderUrl = targetNetwork.rpcUrl

const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER
  ? process.env.REACT_APP_PROVIDER
  : localProviderUrl

export const localProvider = new JsonRpcProvider(localProviderUrlFromEnv)
