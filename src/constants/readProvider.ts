import * as providers from '@ethersproject/providers'
import { readNetwork } from './networks'

export const readProvider = new providers.JsonRpcBatchProvider(
  readNetwork.rpcUrl,
  readNetwork.chainId,
)
