import axios from 'axios'
import { useQuery } from 'react-query'

export const useAddressIsGnosisSafe = (address?: string) => {
  return (
    useQuery(['address-is-gnosis-safe', address], async () => {
      if (!address) {
        return
      }

      try {
        const response = await axios.get(
          `https://safe-transaction.gnosis.io/api/v1/safes/${address}`,
        )
        if (response.data) {
          return true
        }
        return false
      } catch (error) {
        return false
      }
    }),
    {
      retry: false,
    }
  )
}
