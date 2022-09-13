import { V3ContractName } from 'models/v3/contracts'

import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/metadataDomain'
import useV3ContractReader from './V3ContractReader'

export default function useProjectMetadataContent(
  projectId: number | undefined,
) {
  return useV3ContractReader<string>({
    contract: V3ContractName.JBProjects,
    functionName: 'metadataContentOf',
    args: projectId ? [projectId, JUICEBOX_MONEY_METADATA_DOMAIN] : null,
  })
}
