import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'
import useV2ContractReader from './useV2ContractReader'

export function useTotalNftRedemptionWeight({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}) {
  const {
    contracts: { JB721TieredDelegateStore },
  } = useContext(JB721DelegateContractsContext)

  const args = dataSourceAddress ? [dataSourceAddress] : null
  return useV2ContractReader<BigNumber>({
    contract: JB721TieredDelegateStore,
    functionName: 'totalRedemptionWeight',
    args,
  })
}
