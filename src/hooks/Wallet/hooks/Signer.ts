import { JsonRpcBatchProvider, Web3Provider } from '@ethersproject/providers'
import { useMemo } from 'react'

import { useProvider } from './Provider'

export function useSigner() {
  const provider = useProvider()
  const signer = useMemo(() => {
    if (provider instanceof JsonRpcBatchProvider) {
      return undefined
    }
    if (provider instanceof Web3Provider) {
      return provider?.getSigner()
    }

    console.error('FATAL: unexpected lack of provider found')
    throw new Error('FATAL: unexpected lack of provider found')
  }, [provider])
  return signer
}
