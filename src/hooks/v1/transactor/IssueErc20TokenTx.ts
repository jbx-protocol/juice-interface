import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'

export function useV1IssueErc20TokenTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ name, symbol }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'issue',
      [BigNumber.from(projectId).toHexString(), name, symbol],
      {
        ...txOpts,
        title: t`Issue $${symbol}`,
      },
    )
  }
}
