import { JsonRpcBatchProvider } from '@ethersproject/providers'

import { readNetwork } from './networks'

export const readProvider = new JsonRpcBatchProvider(readNetwork.rpcUrl)
