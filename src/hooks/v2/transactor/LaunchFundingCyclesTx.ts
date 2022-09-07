import { V2UserContext } from 'contexts/v2/userContext'
import { useWallet } from 'hooks/Wallet'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'
import { useContext } from 'react'

import { GroupedSplits, SplitGroup } from 'models/splits'
import { isValidMustStartAtOrAfter } from 'utils/v2/fundingCycle'

import { TransactorInstance } from 'hooks/Transactor'
import { t } from '@lingui/macro'
import { useV2ProjectTitle } from '../ProjectTitle'

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately
const DEFAULT_MEMO = ''

export function useLaunchFundingCyclesTx(): TransactorInstance<{
  projectId: number
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
}> {
  const { transactor, contracts } = useContext(V2UserContext)
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
      [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal)
      DEFAULT_MEMO,
    ]

    return transactor(contracts.JBController, 'launchFundingCyclesFor', args, {
      ...txOpts,
      title: t`Launch funding cycles for ${projectTitle}`,
    })
  }
}
