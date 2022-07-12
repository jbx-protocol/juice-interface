import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import { NetworkContext } from 'contexts/networkContext'

import { TransactorInstance } from '../../Transactor'

export function useSetV1ProjectIdTx(): TransactorInstance<{
  v1ProjectId: number
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
  const { signingProvider } = useContext(NetworkContext)

  return ({ v1ProjectId }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !signingProvider ||
      !contracts?.JBV1TokenPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBV1TokenPaymentTerminal,
      'setV1ProjectIdOf',
      [projectId, v1ProjectId],
      txOpts,
    )
  }
}
