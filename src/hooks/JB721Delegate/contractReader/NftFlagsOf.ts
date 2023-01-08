import { useStoreOfJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useStoreofJB721TieredDelegate'
import { JBTiered721Flags } from 'models/nftRewardTier'
import useV2ContractReader from '../../v2v3/contractReader/V2ContractReader'

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
