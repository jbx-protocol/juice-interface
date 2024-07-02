import { ethers } from 'ethers'
import { resolveAddress } from 'lib/api/ens'
import { useQuery } from 'react-query'

/**
 * Try to resolve an address to an ENS name.
 */
export function useEnsName(
  address: string | undefined,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery(
    ['ensName', address],
    async () => {
      if (!address || !ethers.isAddress(address)) return

      const data = await resolveAddress(address)

      return data.name
    },
    {
      enabled,
    },
  )
}
