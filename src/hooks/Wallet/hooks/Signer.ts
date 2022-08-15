import { useMemo } from 'react'

import { useProvider } from './Provider'

export function useSigner() {
  const provider = useProvider()
  const signer = useMemo(() => provider?.getSigner(), [provider])
  return signer
}
