import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GnosisSafe } from 'models/safe'

export const useGnosisSafe = (address?: string) => {
  return useQuery({
    queryKey: ['gnosis-safe', address],
    queryFn: async () => {
      if (!address) {
        return
      }

      try {
        const response = await axios.get(
          `https://safe-transaction-mainnet.safe.global/api/v1/safes/${address}`,
        )
        if (response.data) {
          return response.data as GnosisSafe
        }
        return null
      } catch (error) {
        return null
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  })
}
