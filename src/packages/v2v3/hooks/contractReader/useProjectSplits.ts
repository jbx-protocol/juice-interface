import { BigNumber } from 'ethers'
import isEqual from 'lodash/isEqual'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { Split, SplitGroup } from 'packages/v2v3/models/splits'

import { useCallback } from 'react'

import useV2ContractReader from './useV2ContractReader'

type SplitResult = {
  percent: BigNumber
  lockedUntil: BigNumber
  projectId: BigNumber
  beneficiary: string
  allocator: string
  preferClaimed: boolean
}

const formatSplitResult = (splitResult: SplitResult[]) => {
  return splitResult.map((split: SplitResult) => {
    return {
      percent: split.percent.toNumber(),
      lockedUntil: split.lockedUntil.toNumber(),
      projectId: split.projectId.toHexString(),
      beneficiary: split.beneficiary,
      allocator: split.allocator,
      preferClaimed: split.preferClaimed,
    }
  })
}

export default function useProjectSplits({
  projectId,
  splitGroup,
  domain,
}: {
  projectId: number | undefined
  splitGroup: SplitGroup
  domain: string | undefined
}) {
  return useV2ContractReader<Split[]>({
    contract: V2V3ContractName.JBSplitsStore,
    functionName: 'splitsOf',
    args: projectId && domain ? [projectId, domain, splitGroup] : null,
    formatter: useCallback((value: unknown): Split[] => {
      return formatSplitResult((value ?? []) as SplitResult[])
    }, []),
    valueDidChange: useCallback(
      (oldValue: Split[] | undefined, newValue: Split[] | undefined) => {
        return !isEqual(oldValue, newValue)
      },
      [],
    ),
  })
}
