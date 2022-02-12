import { BigNumber } from 'ethers'

import { V2ContractName } from 'models/v2/contracts'

import { PEEL_METADATA_DOMAIN } from 'constants/v2/metadataDomain'

import useV2ContractReader from './V2ContractReader'

export default function useProjectMetadataContent(projectId?: BigNumber) {
  return useV2ContractReader<string>({
    contract: V2ContractName.JBProjects,
    functionName: 'metadataContentOf',
    args: projectId ? [projectId.toHexString(), PEEL_METADATA_DOMAIN] : null,
  })
}
