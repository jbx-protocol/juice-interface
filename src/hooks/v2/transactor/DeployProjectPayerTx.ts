import * as constants from '@ethersproject/constants'
import { t } from '@lingui/macro'
import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

export type DeployProjectPayerTxArgs = {
  customBeneficiaryAddress: string | undefined
  customMemo: string | undefined
  tokenMintingEnabled: boolean
  preferClaimed: boolean
}

export function useDeployProjectPayerTx(): TransactorInstance<DeployProjectPayerTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  const DEFAULT_MEMO = ''
  const DEFAULT_METADATA = [0x1]

  return (
    {
      customBeneficiaryAddress,
      customMemo,
      tokenMintingEnabled,
      preferClaimed,
    },
    txOpts,
  ) => {
    if (!transactor || !projectId || !contracts?.JBETHPaymentTerminal) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts?.JBETHERC20ProjectPayerDeployer,
      'deployProjectPayer',
      [
        projectId,
        customBeneficiaryAddress ?? constants.AddressZero, // defaultBeneficiary is none because we want tokens to go to msg.sender
        preferClaimed, // _defaultPreferClaimedTokens,
        customMemo ?? DEFAULT_MEMO, // _defaultMemo,
        DEFAULT_METADATA, //_defaultMetadata,
        !tokenMintingEnabled, // defaultPreferAddToBalance,
        contracts.JBDirectory.address, // _directory,
        userAddress, //, _owner
      ],
      {
        ...txOpts,
        title: t`Deploy project payer for ${projectTitle}`,
      },
    )
  }
}
