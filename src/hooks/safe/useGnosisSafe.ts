import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GnosisSafe } from 'models/safe'

// Map chainId to Safe API network name
const getSafeNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 11155111:
      return 'sepolia'
    case 42161:
      return 'arbitrum'
    case 10:
      return 'optimism'
    case 8453:
      return 'base'
    default:
      return 'mainnet' // Fallback to mainnet
  }
}

export const useGnosisSafe = (address?: string, chainId?: number) => {
  const networkName = getSafeNetworkName(chainId ?? 1)

  return useQuery({
    queryKey: ['gnosis-safe', address, chainId],
    queryFn: async () => {
      if (!address) {
        return null
      }

      try {
        const response = await axios.get(
          `https://safe-transaction-${networkName}.safe.global/api/v1/safes/${address}`,
        )
        if (response.data) {
          return response.data as GnosisSafe
        }
        return null
      } catch (error) {
        // 404 is expected when address is not a Safe - don't log it
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null
        }
        // Log unexpected errors
        console.warn('Error fetching Safe data:', error)
        return null
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  })
}
