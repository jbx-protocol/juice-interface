import { JsonRpcProvider } from 'ethers'
import { readNetwork } from './networks'

export const readProvider = new JsonRpcProvider(
  readNetwork.rpcUrl,
  readNetwork.chainId,
)
