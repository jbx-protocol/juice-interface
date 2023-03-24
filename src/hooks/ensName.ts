import { isAddress } from 'ethers/lib/utils'
import { resolveAddress } from 'lib/api/ens'
import { useEffect, useState } from 'react'

/**
 * Try to resolve an address to an ENS name.
 */
export function useEnsName(address: string | undefined) {
  const [ensName, setEnsName] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    async function loadEnsName() {
      if (!address || !isAddress(address)) return

      // if a fetch is already in progress, bail
      if (loading) {
        return
      }

      setLoading(true)
      const data = await resolveAddress(address)

      // update state
      setEnsName(data.name)
      setLoading(false)
    }

    loadEnsName()
  }, [address, loading])

  return ensName
}
