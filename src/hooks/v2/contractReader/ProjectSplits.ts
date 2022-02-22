import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'
import { SplitGroup } from 'models/v2/splits'

import { PEEL_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import useV2ContractReader from './V2ContractReader'

export default function useProjectSplits<G>({
  projectId,
  splitGroup,
}: {
  projectId?: BigNumber
  splitGroup: SplitGroup
}) {
  return useV2ContractReader<G[]>({
    contract: V2ContractName.JBSplitsStore,
    functionName: 'splitsOf',
    args: projectId
      ? [projectId.toHexString(), PEEL_METADATA_DOMAIN, splitGroup]
      : null,
  })
}
