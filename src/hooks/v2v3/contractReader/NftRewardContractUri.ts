import * as constants from '@ethersproject/constants'
import { V2V3ContractName } from 'models/v2v3/contracts'
import useV2ContractReader from './V2ContractReader'

// get the contract URI (cid for collection's metadata on IPFS) of an NFT collection
export function useNftRewardContractUri(dataSourceAddress: string | undefined) {
  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBTiered721DelegateStore,
    functionName: 'contractUriOf',
    // send null when project has no dataSource, so the fetch doesn't execute.
    args: hasDataSource ? [dataSourceAddress] : null,
  })
}
