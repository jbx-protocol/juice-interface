import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useEffect, useState } from 'react'

import { Contracts } from '../models/contracts'
import { LabelVal } from '../models/label-val'
import { erc20Contract } from '../utils/erc20Contract'
import useContractReader from './ContractReader'

export function useAllowedTokens(
  contracts?: Contracts,
  provider?: JsonRpcProvider,
) {
  const [tokens, setTokens] = useState<LabelVal<string>[]>([])

  const tokenAddresses = useContractReader<string[]>({
    contract: contracts?.Juicer,
    functionName: 'getWantTokenAllowList',
  })

  useEffect(() => {
    async function getTokens() {
      if (!tokenAddresses) return

      const newTokens = await Promise.all(
        tokenAddresses
          .filter(token => !!token && !!provider)
          .map(async token => {
            const contract = erc20Contract(token, provider) as Contract
            const symbol: string = await contract['symbol']()

            return {
              label: symbol,
              value: token,
            }
          }),
      )

      if (newTokens !== tokens) setTokens(newTokens)
    }

    getTokens()
  }, [tokenAddresses, provider, setTokens])

  return tokens
}
