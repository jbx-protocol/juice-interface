import { NetworkContext } from 'contexts/networkContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useDeployProjectTx(): TransactorInstance<{
  handle: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)

  return ({}, txOpts) => {
    if (
      !transactor ||
      !userAddress ||
      !contracts?.JBController ||
      !contracts.JBETHPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const fundingCycleData = {
      duration: 0,
      weight: BigNumber.from('1' + '0'.repeat(18)), // 1,000,000 of your project's tokens will be minted per ETH received
      discountRate: 0,
      ballot: constants.AddressZero,
    }

    const funcingCycleMetadata = {
      reservedRate: 0,
      redemptionRate: 0,
      ballotRedemptionRate: 0,
      pausePay: 0,
      pauseDistributions: 0,
      pauseRedeem: 0,
      pauseMint: 0,
      pauseBurn: 0,
      allowTerminalMigration: 0,
      allowControllerMigration: 0,
      holdFees: 0,
      useLocalBalanceForRedemptions: 0,
      useDataSourceForPay: 0,
      useDataSourceForRedeem: 0,
      dataSource: constants.AddressZero,
    }

    const args = [
      userAddress, // _owner
      ['', 1234], // _projectMetadata (JBProjectMetadata)
      fundingCycleData, // _data (JBFundingCycleData)
      funcingCycleMetadata, // _metadata (JBFundingCycleMetadata)
      '1', // _mustStartAtOrAfter
      [], // _groupedSplits,
      [], // _fundAccessConstraints,
      [contracts.JBETHPaymentTerminal.address], //  _terminals (contract address of the JBETHPaymentTerminal)
    ]

    return transactor(contracts.JBController, 'launchProjectFor', args, txOpts)
  }
}
