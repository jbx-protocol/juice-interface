import { useQuery } from '@tanstack/react-query'
import { isAddress } from 'ethers/lib/utils'
import { resolveAddress } from 'lib/api/ens'

/**
 * Try to resolve an address to an ENS name.
 */
export function useEnsName(
  address: string | undefined,
  { enabled }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ['ensName', address],
    queryFn: async () => {
      if (!address || !isAddress(address)) return

      const data = await resolveAddress(address)

      return data.name
    },

    enabled,
  })
}
