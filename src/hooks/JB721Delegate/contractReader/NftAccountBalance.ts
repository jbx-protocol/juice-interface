import { BigNumber } from '@ethersproject/bignumber'
import { useStoreOfJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useStoreofJB721TieredDelegate'
import useV2ContractReader from '../../v2v3/contractReader/V2ContractReader'

export function useNftAccountBalance({
  dataSourceAddress,
  accountAddress,
}: {
  dataSourceAddress: string | undefined
  accountAddress: string | undefined
}) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })

  const args =
    accountAddress && accountAddress
      ? [dataSourceAddress, accountAddress]
      : null

  return useV2ContractReader<BigNumber>({
    contract: JBTiered721DelegateStore,
    functionName: 'balanceOf',
    args,
  })
}
