import { isAddress } from 'ethers/lib/utils'
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
      if (!address || !isAddress(address)) return

      const data = await resolveAddress(address)

      return data.name
    },
    {
      enabled,
    },
  )
}
