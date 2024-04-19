import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useContext } from 'react'
import useV2ContractReader from './useV2ContractReader'

export function useRedemptionWeightOfNfts({
  tokenIdsToRedeem,
  dataSourceAddress,
}: {
  tokenIdsToRedeem: string[] | undefined
  dataSourceAddress: string | undefined
}) {
  const {
    contracts: { JB721TieredDelegateStore },
  } = useContext(JB721DelegateContractsContext)

  const _tokenIds = tokenIdsToRedeem?.map(idString => BigInt(idString))
  const args =
    dataSourceAddress && _tokenIds ? [dataSourceAddress, _tokenIds] : null
  return useV2ContractReader<bigint>({
    contract: JB721TieredDelegateStore,
    functionName: 'redemptionWeightOf',
    args,
  })
}
