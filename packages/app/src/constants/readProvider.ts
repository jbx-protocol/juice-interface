import { JsonRpcProvider } from '@ethersproject/providers'

import { readNetwork } from './networks'

export const readProvider = new JsonRpcProvider(readNetwork.rpcUrl)
