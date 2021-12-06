import { useQuery } from 'react-query'

import { readProvider } from 'constants/readProvider'

export function useEthBalanceQuery(address: string | undefined) {
  return useQuery(
    ['eth-balance', address],
    async () => {
      if (!address) {
        throw new Error("Can't fetch ETH balance, address is undefined")
      }
      return readProvider.getBalance(address)
    },
    {
      enabled: !!address,
      staleTime: 30000,
      refetchInterval: 30000,
    },
  )
}
