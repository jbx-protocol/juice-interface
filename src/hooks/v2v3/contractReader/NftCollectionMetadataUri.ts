import * as constants from '@ethersproject/constants'
import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export function useNftCollectionMetadataUri(
  dataSourceAddress: string | undefined,
) {
  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBTiered721DelegateStore,
    functionName: 'contractUriOf',
    args: hasDataSource ? [dataSourceAddress] : null,
  })
}
