import { t } from '@lingui/macro'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { isValidMustStartAtOrAfter } from 'packages/v2v3/utils/fundingCycle'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { useV2ProjectTitle } from '../useProjectTitle'
import { LaunchProjectData } from './useLaunchProjectTx'

export type ReconfigureFundingCycleTxParams = Omit<
  LaunchProjectData,
  'projectMetadataCID'
> & {
  memo?: string
}

export function useReconfigureV2V3FundingCycleTx(): TransactorInstance<ReconfigureFundingCycleTxParams> {
  const { transactor } = useContext(TransactionContext)
  const {
    contracts: { JBController: projectJBController },
  } = useContext(V2V3ProjectContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  return (
    {
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      groupedSplits = [],
      mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
      memo = DEFAULT_MEMO,
    },
    txOpts,
  ) => {
    if (
      !transactor ||
      !projectId ||
      !projectJBController ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      projectJBController,
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
        title: t`Edit ${projectTitle}'s rules`,
      },
    )
  }
}
