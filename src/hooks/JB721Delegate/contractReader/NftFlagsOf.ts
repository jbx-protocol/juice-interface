import { JBTiered721Flags } from 'models/nftRewardTier'
import useV2ContractReader from '../../v2v3/contractReader/V2ContractReader'
import { useStoreOfJB721TieredDelegate } from '../contracts/useStoreofJB721TieredDelegate'

export function useNftFlagsOf(dataSourceAddress: string | undefined) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })
  return useV2ContractReader<JBTiered721Flags>({
    contract: JBTiered721DelegateStore,
    functionName: 'flagsOf',
    args: [dataSourceAddress],
  })
}
