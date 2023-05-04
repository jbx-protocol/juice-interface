import { t } from '@lingui/macro'
import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { constants } from 'ethers'

import { TransactorInstance } from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../ProjectTitle'

type DeploySplitsPayerTxArgs = {
  customBeneficiaryAddress: string | undefined
  customMemo: string | undefined
  tokenMintingEnabled: boolean
  preferClaimed: boolean
}

export function useDeploySplitsPayerTx(): TransactorInstance<DeploySplitsPayerTxArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  const DEFAULT_METADATA = [0x1]

  const defaultSplitsDomain = 1
  const defaultSplitsGroup = 1

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
      contracts?.JBETHERC20SplitsPayerDeployer,
      'deploySplitsPayer',
      [
        projectId, // _defaultSplitsProjectId
        defaultSplitsDomain, // _defaultSplitsDomain
        defaultSplitsGroup, // _defaultSplitsGroup
        contracts.JBSplitsStore.address, // _splitsStore
        projectId, // _defaultProjectId: leftover funds go here
        customBeneficiaryAddress ?? constants.AddressZero, // defaultBeneficiary is none because we want tokens to go to msg.sender
        preferClaimed, // _defaultPreferClaimedTokens,
        customMemo ?? DEFAULT_MEMO, // _defaultMemo,
        DEFAULT_METADATA, //_defaultMetadata,
        !tokenMintingEnabled, // defaultPreferAddToBalance,
        userAddress, //, _owner
      ],
      {
        ...txOpts,
        title: t`Create a splits payer address for ${projectTitle}`,
      },
    )
  }
}
