import { t } from '@lingui/macro'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { constants } from 'ethers'

import { useWallet } from 'hooks/Wallet'
import { TransactorInstance } from 'hooks/useTransactor'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../useProjectTitle'

export type DeployProjectPayerTxArgs = {
  customBeneficiaryAddress: string | undefined
  customMemo: string | undefined
  tokenMintingEnabled: boolean
  preferClaimed: boolean
}

/**
 *
 * @dev ONLY LATEST JB PROJECT SUPPORTED! Won't work if deploying a project payer on an older project.
 */
export function useDeployProjectPayerTx(): TransactorInstance<DeployProjectPayerTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

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
    if (!transactor || !projectId || !contracts) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts?.JBETHERC20ProjectPayerDeployer,
      'deployProjectPayer',
      [
        projectId, // _defaultProjectId
        customBeneficiaryAddress ?? constants.AddressZero, // _defaultBeneficiary, is 0x00 because we want tokens to go to msg.sender
        preferClaimed, // _defaultPreferClaimedTokens
        customMemo ?? DEFAULT_MEMO, // _defaultMemo
        DEFAULT_METADATA, //_defaultMetadata
        !tokenMintingEnabled, // defaultPreferAddToBalance
        userAddress, // _owner
      ],
      {
        ...txOpts,
        title: t`Create a project payer address for ${projectTitle}`,
      },
    )
  }
}
