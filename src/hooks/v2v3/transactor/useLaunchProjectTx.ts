import { t } from '@lingui/macro'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useWallet } from 'hooks/Wallet'
import { useDefaultJBController } from 'hooks/defaultContracts/useDefaultJBController'
import { useDefaultJBETHPaymentTerminal } from 'hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import { TransactorInstance } from 'hooks/useTransactor'
import { GroupedSplits, SplitGroup } from 'models/splits'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import {
  getTerminalsFromFundAccessConstraints,
  isValidMustStartAtOrAfter,
} from 'utils/v2v3/fundingCycle'
import { useV2ProjectTitle } from '../useProjectTitle'

export interface LaunchProjectData {
  projectMetadataCID: string
  fundingCycleData: V2V3FundingCycleData
  fundingCycleMetadata: V2V3FundingCycleMetadata
  fundAccessConstraints: V2V3FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  owner?: string // If not provided, the current user's address will be used.
}

export function useLaunchProjectTx(): TransactorInstance<LaunchProjectData> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const defaultJBController = useDefaultJBController()
  const { userAddress } = useWallet()

  const projectTitle = useV2ProjectTitle()
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()

  return (
    {
      owner,
      projectMetadataCID,
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
      const missingParam = !transactor
        ? 'transactor'
        : !userAddress
        ? 'userAddress'
        : !contracts
        ? 'contracts'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Transaction failed, missing argument "${
            missingParam ?? '<unknown>'
          }".`,
        ),
      )
      return Promise.resolve(false)
    }

    const _owner = owner && owner.length ? owner : userAddress

    const args = [
      _owner, // _owner
      [projectMetadataCID, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN], // _projectMetadata (JBProjectMetadata)
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

    return transactor(defaultJBController, 'launchProjectFor', args, {
      ...txOpts,
      title: t`Launch ${projectTitle}`,
    })
  }
}
