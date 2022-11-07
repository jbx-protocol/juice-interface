import * as constants from '@ethersproject/constants'
import { useStoreOfJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useStoreofJB721TieredDelegate'
import useV2ContractReader from './V2ContractReader'

// get the contract URI (cid for collection's metadata on IPFS) of an NFT collection
export function useNftRewardContractUri(dataSourceAddress: string | undefined) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })

  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero

  return useV2ContractReader<string>({
    contract: JBTiered721DelegateStore,
    functionName: 'contractUriOf',
    // send null when project has no dataSource, so the fetch doesn't execute.
    args: hasDataSource ? [dataSourceAddress] : null,
  })
}
