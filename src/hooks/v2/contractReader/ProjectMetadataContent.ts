import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import useV2ContractReader from './V2ContractReader'

export default function useProjectMetadataContent(
  projectId: BigNumber | undefined,
) {
  return useV2ContractReader<string>({
    contract: V2ContractName.JBProjects,
    functionName: 'metadataContentOf',
    args: projectId ? [projectId, JUICEBOX_MONEY_METADATA_DOMAIN] : null,
  })
}
