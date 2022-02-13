import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'
import { PEEL_METADATA_DOMAIN } from 'constants/v2/metadataDomain'

type V2FundingCycleData = {
  duration: number
  weight: BigNumber
  discountRate: number
  ballot: string // hex, contract address
}

type V2FundingCycleMetadata = {
  reservedRate: number
  redemptionRate: number
  ballotRedemptionRate: number
  pausePay: number
  pauseDistributions: number
  pauseRedeem: number
  pauseMint: number
  pauseBurn: number
  allowTerminalMigration: number
  allowControllerMigration: number
  holdFees: number
  useLocalBalanceForRedemptions: number
  useDataSourceForPay: number
  useDataSourceForRedeem: number
  dataSource: string // hex, contract address
}

export function useDeployProjectTx(): TransactorInstance<{
  projectMetadataCID: string
  fundingCycleData: V2FundingCycleData
  fundingCycleMetadata: V2FundingCycleMetadata
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)

  return (
    { projectMetadataCID, fundingCycleData, fundingCycleMetadata },
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
      [], // _fundAccessConstraints,
      [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal)
    ]

    return transactor(contracts.JBController, 'launchProjectFor', args, txOpts)
  }
}
