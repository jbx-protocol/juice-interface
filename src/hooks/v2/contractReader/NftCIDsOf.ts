import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export function useNftCIDsOf(projectId: number | undefined) {
  return useV2ContractReader<string[]>({
    contract: V2ContractName.DeprecatedJBController, //TODO: NFTRewards,
    functionName: 'tokenURI',
    args: projectId ? [projectId] : null,
  })
}
