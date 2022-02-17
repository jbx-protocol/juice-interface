import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import {
  V2FundAccessConstraint,
  V2FundingCycleData,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import { TransactorInstance } from '../../Transactor'
import { PEEL_METADATA_DOMAIN } from 'constants/v2/metadataDomain'

export function useDeployProjectTx(): TransactorInstance<{
  projectMetadataCID: string
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
  fundAccessConstraints: V2FundAccessConstraint[]
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)

  return (
    {
      projectMetadataCID,
      fundingCycleData,
      fundingCycleMetadata,
      fundAccessConstraints,
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
      '1', // _mustStartAtOrAfter
      [], // _groupedSplits,
      fundAccessConstraints, // _fundAccessConstraints,
      [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal)
    ]

    return transactor(contracts.JBController, 'launchProjectFor', args, txOpts)
  }
}
