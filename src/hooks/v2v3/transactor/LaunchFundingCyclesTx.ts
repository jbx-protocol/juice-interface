import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import {
  getTerminalsFromFundAccessConstraints,
  isValidMustStartAtOrAfter,
} from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../ProjectTitle'
import { LaunchProjectData } from './LaunchProjectTx'

const DEFAULT_MEMO = ''

export type LaunchFundingCyclesData = Omit<
  LaunchProjectData,
  'projectMetadataCID'
>

export function useLaunchFundingCyclesTx({
  JBController,
}: {
  JBController?: Contract
} = {}): TransactorInstance<
  {
    projectId: number
  } & LaunchFundingCyclesData
> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)

  const { userAddress } = useWallet()
  const projectTitle = useV2ProjectTitle()

  return (
    {
      projectId,
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
      groupedSplits = [],
      mustStartAtOrAfter = DEFAULT_MUST_START_AT_OR_AFTER,
    },
    txOpts,
  ) => {
    if (
      !transactor ||
      !userAddress ||
      !contracts?.JBController ||
      !contracts?.JBETHPaymentTerminal ||
      !isValidMustStartAtOrAfter(mustStartAtOrAfter, fundingCycleData.duration)
    ) {
      return Promise.resolve(false)
    }

    const args = [
      projectId, // _projectId
      fundingCycleData, // _data (JBFundingCycleData)
      fundingCycleMetadata, // _metadata (JBFundingCycleMetadata)
      mustStartAtOrAfter, // _mustStartAtOrAfter
      groupedSplits, // _groupedSplits,
      fundAccessConstraints, // _fundAccessConstraints,
      getTerminalsFromFundAccessConstraints(fundAccessConstraints), // _terminals
      DEFAULT_MEMO,
    ]

    return transactor(
      JBController ?? contracts.JBController,
      'launchFundingCyclesFor',
      args,
      {
        ...txOpts,
        title: t`Launch funding cycles for ${projectTitle}`,
      },
    )
  }
}
