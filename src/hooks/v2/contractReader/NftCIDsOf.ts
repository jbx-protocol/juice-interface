import { getNftDataSourceContract } from 'utils/v2/nftRewards'

import useV2ContractReader from './V2ContractReader'

export function useNftCIDsOf(dataSourceAddress: string) {
  return useV2ContractReader<string[]>({
    contract: getNftDataSourceContract(dataSourceAddress),
    functionName: 'allTiers',
    args: null,
  })
}
