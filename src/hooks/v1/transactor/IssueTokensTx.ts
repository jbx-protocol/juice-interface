import { BigNumber } from '@ethersproject/bignumber'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useIssueTokensTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId } = useContext(V1ProjectContext)

  return ({ name, symbol }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'issue',
      [BigNumber.from(projectId).toHexString(), name, symbol],
      txOpts,
    )
  }
}
