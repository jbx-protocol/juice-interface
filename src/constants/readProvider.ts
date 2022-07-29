import { JsonRpcBatchProvider } from '@ethersproject/providers'

import { readNetwork } from './networks'

const _provider = new JsonRpcBatchProvider(readNetwork.rpcUrl)
export const readProvider = await (async () => {
  await _provider.ready
  return _provider
})()
