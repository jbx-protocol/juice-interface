import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

export function useChain() {
  const { chain: connectedChain, chains } = useNetwork()

  const chain = useMemo(
    () =>
      connectedChain
        ? {
            id: connectedChain.id,
            name:
              chains.find(c => BigNumber.from(c.id).eq(connectedChain.id))
                ?.name ?? 'Unknown',
          }
        : undefined,
    [chains, connectedChain],
  )
  return chain
}
