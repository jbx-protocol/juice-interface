import { useSetChain } from '@web3-onboard/react'
import { useCallback } from 'react'
import { unpadLeadingZerosString } from 'utils/bigNumbers'

import { readNetwork } from 'constants/networks'

export function useChangeNetworks() {
  const [{ chains }, setChain] = useSetChain()

  const changeNetworks = useCallback(async () => {
    const chain = chains.find(c => BigInt(c.id) === BigInt(readNetwork.chainId))
    if (!chain) {
      console.error('FATAL: Chain not found')
      throw new Error('FATAL: Chain not found')
    }
    return await setChain({
      chainId: unpadLeadingZerosString(chain.id),
      chainNamespace: chain.namespace,
    })
  }, [chains, setChain])

  return changeNetworks
}
