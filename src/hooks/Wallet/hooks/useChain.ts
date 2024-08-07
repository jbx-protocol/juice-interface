import { useSetChain } from '@web3-onboard/react'
import { useMemo } from 'react'

export function useChain() {
  const [{ connectedChain, chains }] = useSetChain()
  const chain = useMemo(
    () =>
      connectedChain
        ? {
            id: connectedChain.id,
            name:
              chains.find(c => c.id === connectedChain.id)?.label ?? 'Unknown',
          }
        : undefined,
    [chains, connectedChain],
  )
  return chain
}
