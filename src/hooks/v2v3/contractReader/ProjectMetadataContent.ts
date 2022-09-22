import { V2V3ContractName } from 'models/v2v3/contracts'

import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import useV2ContractReader from './V2ContractReader'

export default function useProjectMetadataContent(
  projectId: number | undefined,
) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBProjects,
    functionName: 'metadataContentOf',
    args: projectId
      ? [projectId, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN]
      : null,
  })
}
