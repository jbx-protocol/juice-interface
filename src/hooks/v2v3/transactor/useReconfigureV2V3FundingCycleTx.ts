import { t } from '@lingui/macro'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { isValidMustStartAtOrAfter } from 'utils/v2v3/fundingCycle'
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
