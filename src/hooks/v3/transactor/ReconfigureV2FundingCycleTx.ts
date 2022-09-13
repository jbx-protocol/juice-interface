import { useContext } from 'react'

import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'
import { TransactorInstance } from 'hooks/Transactor'
import { GroupedSplits, SplitGroup } from 'models/splits'
import {
  V3FundAccessConstraint,
  V3FundingCycleData,
  V3FundingCycleMetadata,
} from 'models/v3/fundingCycle'
import { isValidMustStartAtOrAfter } from 'utils/v3/fundingCycle'

const DEFAULT_MUST_START_AT_OR_AFTER = '1'

export function useReconfigureV3FundingCycleTx(): TransactorInstance<{
  fundingCycleData: V3FundingCycleData
  fundingCycleMetadata: V3FundingCycleMetadata
  fundAccessConstraints: V3FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  memo: string
}> {
  const { transactor, contracts } = useContext(V3UserContext)
  const { projectId } = useContext(V3ProjectContext)

  return (
    {
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      groupedSplits = [],
      mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
      memo,
    },
    txOpts,
  ) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.JBController ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBController,
      'reconfigureFundingCyclesOf',
      [
        projectId,
        fundingCycleData,
        fundingCycleMetadata,
        mustStartAtOrAfter,
        groupedSplits,
        fundAccessConstraints,
        memo,
      ],
      txOpts,
    )
  }
}
