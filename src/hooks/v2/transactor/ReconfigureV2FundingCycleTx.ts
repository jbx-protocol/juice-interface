import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { GroupedSplits, SplitGroup } from 'models/splits'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'
import { isValidMustStartAtOrAfter } from 'utils/v2/fundingCycle'
import { useV2ProjectTitle } from '../ProjectTitle'

const DEFAULT_MUST_START_AT_OR_AFTER = '1'

export function useReconfigureV2FundingCycleTx(): TransactorInstance<{
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  memo: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

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
      {
        ...txOpts,
        title: t`Reconfigure ${projectTitle}`,
      },
    )
  }
}
