import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'
import { Split, SplitGroup } from 'models/v2/splits'

import useV2ContractReader from './V2ContractReader'

export default function useProjectSplits({
  projectId,
  splitGroup,
  domain,
}: {
  projectId?: BigNumber
  splitGroup: SplitGroup
  domain?: string
}) {
  return useV2ContractReader<Split[]>({
    contract: V2ContractName.JBSplitsStore,
    functionName: 'splitsOf',
    args:
      projectId && domain
        ? [projectId.toHexString(), domain, splitGroup]
        : null,
  })
}
