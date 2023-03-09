import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useDefaultJBController } from 'hooks/defaultContracts/DefaultJBController'
import { useDefaultJBETHPaymentTerminal } from 'hooks/defaultContracts/DefaultJBETHPaymentTerminal'
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
  const defaultJBController = useDefaultJBController()
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()

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
      !defaultJBController ||
      !defaultJBETHPaymentTerminal ||
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
      getTerminalsFromFundAccessConstraints(
        fundAccessConstraints,
        defaultJBETHPaymentTerminal?.address,
      ), // _terminals
      DEFAULT_MEMO,
    ]

    return transactor(
      JBController ?? defaultJBController,
      'launchFundingCyclesFor',
      args,
      {
        ...txOpts,
        title: t`Launch cycles for ${projectTitle}`,
      },
    )
  }
}
