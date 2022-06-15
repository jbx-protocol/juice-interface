import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import JBV1TokenPaymentTerminal from '@jbx-protocol/juice-v1-token-terminal/out/JBV1TokenPaymentTerminal.sol/JBV1TokenPaymentTerminal.json'
import { Contract } from '@ethersproject/contracts'
import { NetworkContext } from 'contexts/networkContext'

import { TransactorInstance } from '../../Transactor'
import { JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS } from 'constants/contracts'
import { readNetwork } from 'constants/networks'

export function useSetV1ProjectIdTx(): TransactorInstance<{
  v1ProjectId: number
}> {
  const { transactor } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
  const { signingProvider } = useContext(NetworkContext)

  return ({ v1ProjectId }, txOpts) => {
    const contractAddress =
      JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]

    if (!transactor || !projectId || !contractAddress || !signingProvider) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const v1TokenPaymentTerminalContract = new Contract(
      contractAddress,
      JBV1TokenPaymentTerminal.abi,
      signingProvider.getSigner(),
    )

    return transactor(
      v1TokenPaymentTerminalContract,
      'setV1ProjectIdOf',
      [projectId, v1ProjectId],
      txOpts,
    )
  }
}
