import * as constants from '@ethersproject/constants'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { NetworkContext } from 'contexts/networkContext'

import { TransactorInstance } from '../../Transactor'

export function useDeployProjectPayerTx(): TransactorInstance<{}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)

  const DEFAULT_MEMO = ''
  const DEFAULT_METADATA = [0x1]

  return (_, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBETHPaymentTerminal) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts?.JBETHERC20ProjectPayerDeployer,
      'deployProjectPayer',
      [
        projectId,
        constants.AddressZero, // defaultBeneficiary is none because we want tokens to go to msg.sender
        false, // _defaultPreferClaimedTokens,
        DEFAULT_MEMO, // _defaultMemo,
        DEFAULT_METADATA, //_defaultMetadata,
        false, // defaultPreferAddToBalance,
        contracts.JBDirectory.address, // _directory,
        userAddress, //, _owner
      ],
      {
        ...txOpts,
      },
    )
  }
}
