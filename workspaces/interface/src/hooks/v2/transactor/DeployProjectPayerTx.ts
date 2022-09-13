import * as constants from '@ethersproject/constants'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export type DeployProjectPayerTxArgs = {
  customBeneficiaryAddress: string | undefined
  customMemo: string | undefined
  tokenMintingEnabled: boolean
  preferClaimed: boolean
}

export function useDeployProjectPayerTx(): TransactorInstance<DeployProjectPayerTxArgs> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(V2ProjectContext)

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
      },
    )
  }
}
