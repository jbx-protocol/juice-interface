import { V3UserContext } from 'contexts/v3/userContext'
import { useWallet } from 'hooks/Wallet'
import {
  V3FundAccessConstraint,
  V3FundingCycleData,
  V3FundingCycleMetadata,
} from 'models/v3/fundingCycle'
import { useContext } from 'react'

import { GroupedSplits, SplitGroup } from 'models/splits'
import { isValidMustStartAtOrAfter } from 'utils/v3/fundingCycle'

import { TransactorInstance } from 'hooks/Transactor'

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately
const DEFAULT_MEMO = ''

export function useLaunchFundingCyclesTx(): TransactorInstance<{
  projectId: number
  fundingCycleData: V3FundingCycleData
  fundingCycleMetadata: V3FundingCycleMetadata
  fundAccessConstraints: V3FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
}> {
  const { transactor, contracts } = useContext(V3UserContext)
  const { userAddress } = useWallet()

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
      [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal)
      DEFAULT_MEMO,
    ]

    return transactor(
      contracts.JBController,
      'launchFundingCyclesFor',
      args,
      txOpts,
    )
  }
}
