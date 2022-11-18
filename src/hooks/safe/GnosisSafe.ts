import axios from 'axios'
import { GnosisSafe } from 'models/safe'
import { useQuery } from 'react-query'

export const useGnosisSafe = (address?: string) => {
  return useQuery(
    ['gnosis-safe', address],
    async () => {
      if (!address) {
        return
      }

      try {
        const response = await axios.get(
          `https://safe-transaction.gnosis.io/api/v1/safes/${address}`,
        )
        if (response.data) {
          return response.data as GnosisSafe
        }
        return null
      } catch (error) {
        return null
      }
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  )
}
