import axios from 'axios'
import { TxGasOption } from 'models/tx-gas-option'
import { useQuery } from 'react-query'

export function useGasPriceQuery(speed: TxGasOption) {
  return useQuery(
    ['gas-price', speed],
    async () => {
      const response = await axios.get(
        'https://ethgasstation.info/json/ethgasAPI.json',
      )
      return response.data[speed] * 100000000
    },
    {
      refetchInterval: 30000,
      staleTime: 30000,
    },
  )
}
