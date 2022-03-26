import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'
import { Split, SplitGroup } from 'models/v2/splits'

import useV2ContractReader from './V2ContractReader'

type SplitResult = {
  percent: BigNumber
  lockedUntil: BigNumber
  projectId: BigNumber
  beneficiary: string
  allocator: string
  preferClaimed: boolean
}

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
    formatter(value): Split[] {
      const splitResult = (value ?? []) as SplitResult[]
      return splitResult.map((split: SplitResult) => {
        return {
          percent: split.percent.toNumber(),
          lockedUntil: split.percent.toNumber(),
          projectId: split.percent.toString(),
          beneficiary: split.beneficiary,
          allocator: split.allocator,
          preferClaimed: split.preferClaimed,
        }
      })
    },
  })
}
