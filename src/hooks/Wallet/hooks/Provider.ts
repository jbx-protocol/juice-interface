import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { readNetwork } from 'constants/networks'
import { useMemo } from 'react'

export function useProvider() {
  const readProvider = useMemo(
    () => new JsonRpcBatchProvider(readNetwork.rpcUrl),
    [],
  )
  return readProvider
}
