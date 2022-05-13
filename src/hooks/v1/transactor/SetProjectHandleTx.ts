import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { formatBytes32String } from '@ethersproject/strings'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TransactorInstance } from '../../Transactor'

export function useSetProjectHandleTx(): TransactorInstance<{
  handle: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId } = useContext(V1ProjectContext)

  return ({ handle }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'setHandle',
      [BigNumber.from(projectId).toHexString(), formatBytes32String(handle)],
      txOpts,
    )
  }
}
