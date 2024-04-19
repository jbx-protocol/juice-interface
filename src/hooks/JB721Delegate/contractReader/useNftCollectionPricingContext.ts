import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import useV2ContractReader from 'hooks/v2v3/contractReader/useV2ContractReader'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'

export type NftPricingContext = {
  currency: V2V3CurrencyOption
}

export function useNftCollectionPricingContext() {
  const {
    contracts: { JB721TieredDelegate },
  } = useContext(JB721DelegateContractsContext)

  const response = useV2ContractReader<[bigint, bigint, string]>({
    contract: JB721TieredDelegate,
    functionName: 'pricingContext',
  })

  if (!response?.data) return { ...response, data: undefined }

  const [currency] = response.data

  return {
    ...response,
    data: {
      currency: currency ? Number(currency) : undefined,
    } as NftPricingContext,
  }
}
