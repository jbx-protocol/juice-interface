import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import { GroupedSplits, SplitGroup } from 'models/v2/splits'

import { TransactorInstance } from '../../Transactor'
import { PEEL_METADATA_DOMAIN } from 'constants/v2/metadataDomain'

const DEFAULT_MUST_START_AT_OR_AFTER = '1' // start immediately

export function useDeployProjectTx(): TransactorInstance<{
  projectMetadataCID: string
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraint[]
  groupedSplits?: GroupedSplits<SplitGroup>[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)

  return (
    {
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
      !contracts?.JBController ||
      !contracts.JBETHPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const args = [
      userAddress, // _owner
      [projectMetadataCID, PEEL_METADATA_DOMAIN], // _projectMetadata (JBProjectMetadata)
      fundingCycleData, // _data (JBFundingCycleData)
      fundingCycleMetadata, // _metadata (JBFundingCycleMetadata)
      mustStartAtOrAfter, // _mustStartAtOrAfter
      groupedSplits, // _groupedSplits,
      fundAccessConstraints, // _fundAccessConstraints,
      [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal)
    ]

    return transactor(contracts.JBController, 'launchProjectFor', args, txOpts)
  }
}
