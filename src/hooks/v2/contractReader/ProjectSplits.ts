import { BigNumber } from '@ethersproject/bignumber'
import isEqual from 'lodash/isEqual'
import { Split, SplitGroup } from 'models/splits'
import { V2ContractName } from 'models/v2/contracts'

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
  useDeprecatedContract,
}: {
  projectId: number | undefined
  splitGroup: SplitGroup
  domain: string | undefined
  useDeprecatedContract?: boolean
}) {
  return useV2ContractReader<Split[]>({
    contract: useDeprecatedContract
      ? V2ContractName.DeprecatedJBSplitsStore
      : V2ContractName.JBSplitsStore,
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
