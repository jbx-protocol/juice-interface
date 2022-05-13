import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'
import { Split, SplitGroup } from 'models/v2/splits'
import isEqual from 'lodash/isEqual'

import { useCallback } from 'react'

import useV2ContractReader from './V2ContractReader'

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
    contract: V2ContractName.JBSplitsStore,
    functionName: 'splitsOf',
    args: projectId && domain ? [projectId, domain, splitGroup] : null,
    formatter: useCallback((value): Split[] => {
      return formatSplitResult((value ?? []) as SplitResult[])
    }, []),
    valueDidChange: useCallback((oldValue, newValue) => {
      return !isEqual(oldValue, newValue)
    }, []),
  })
}
