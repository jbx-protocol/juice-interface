import { useContext } from 'react'

import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'
import { GroupedSplits, SplitGroup } from 'models/v2/splits'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { TransactorInstance } from 'hooks/Transactor'

const DEFAULT_MUST_START_AT_OR_AFTER = '1'
const DEFAULT_MEMO = ''

export function useReconfigureV2FundingCycleTx(): TransactorInstance<{
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return (
    {
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      groupedSplits = [],
      mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
    },
    txOpts,
  ) => {
    if (!transactor || !projectId || !contracts?.JBController) {
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
        DEFAULT_MEMO,
      ],
      txOpts,
    )
  }
}
