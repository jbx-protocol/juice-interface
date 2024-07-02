import isEqual from 'lodash/isEqual'
import { Split, SplitGroup } from 'models/splits'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'

import { useCallback } from 'react'

import { toHexString } from 'utils/bigNumbers'
import useV2ContractReader from './useV2ContractReader'

type SplitResult = {
  percent: bigint
  lockedUntil: bigint
  projectId: bigint
  beneficiary: string
  allocator: string
  preferClaimed: boolean
}

const formatSplitResult = (splitResult: SplitResult[]) => {
  return splitResult.map((split: SplitResult) => {
    return {
      percent: Number(split.percent),
      lockedUntil: Number(split.lockedUntil),
      projectId: toHexString(split.projectId),
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
