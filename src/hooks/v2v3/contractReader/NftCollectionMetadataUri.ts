import { useStoreOfJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useStoreofJB721TieredDelegate'
import useV2ContractReader from './V2ContractReader'

export function useNftCollectionMetadataUri(
  dataSourceAddress: string | undefined,
) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })
  return useV2ContractReader<string>({
    contract: JBTiered721DelegateStore,
    functionName: 'contractUriOf',
    args: [dataSourceAddress],
  })
}
