import { BigNumber } from '@ethersproject/bignumber'
import { useStoreOfJB721TieredDelegate } from 'hooks/JB721Delegate/contracts/StoreofJB721TieredDelegate'
import useV2ContractReader from './V2ContractReader'

export function useRedemptionWeightOfNfts({
  tokenIdsToRedeem,
  dataSourceAddress,
}: {
  tokenIdsToRedeem: string[] | undefined
  dataSourceAddress: string | undefined
}) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })

  const _tokenIds = tokenIdsToRedeem?.map(idString => BigNumber.from(idString))
  const args =
    dataSourceAddress && _tokenIds ? [dataSourceAddress, _tokenIds] : null
  return useV2ContractReader<BigNumber>({
    contract: JBTiered721DelegateStore,
    functionName: 'redemptionWeightOf',
    args,
  })
}
