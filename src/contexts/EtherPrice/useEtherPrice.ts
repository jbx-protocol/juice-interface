import axios from 'axios'
import { useQuery } from 'react-query'

/**
 * Chainlink feed doesn't tend to up date that quickly.
 * Refresh every 5 minutes.
 */
const PRICE_REFRESH_INTERVAL = 60 * 1000 * 5 // 5 minutes

/**
 * Return the current price of ETH in USD.
 * @example 1234.69
 */
export function useEtherPrice() {
  return useQuery(
    'etherPrice',
    async () => {
      return axios
        .get<{ price: number }>('/api/juicebox/prices/ethusd')
        .then(res => res.data.price ?? 0)
    },
    {
      staleTime: PRICE_REFRESH_INTERVAL,
    },
  )
}
