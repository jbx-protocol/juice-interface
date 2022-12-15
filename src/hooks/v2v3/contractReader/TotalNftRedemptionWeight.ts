import { BigNumber } from '@ethersproject/bignumber'
import { useStoreOfJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useStoreofJB721TieredDelegate'
import useV2ContractReader from './V2ContractReader'

export function useTotalNftRedemptionWeight({
  dataSourceAddress,
}: {
  dataSourceAddress: string | undefined
}) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })

  const args = dataSourceAddress ? [dataSourceAddress] : null
  return useV2ContractReader<BigNumber>({
    contract: JBTiered721DelegateStore,
    functionName: 'totalRedemptionWeight',
    args,
  })
}
