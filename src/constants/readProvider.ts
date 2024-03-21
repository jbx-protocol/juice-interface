import { providers } from 'ethers'
import { readNetwork } from './networks'

export const readProvider = new providers.StaticJsonRpcProvider(
  readNetwork.rpcUrl,
  readNetwork.chainId,
)
