import { providers } from 'ethers'
import { readNetwork } from './networks'

export const readProvider = new providers.JsonRpcBatchProvider(
  readNetwork.rpcUrl,
  readNetwork.chainId,
)
