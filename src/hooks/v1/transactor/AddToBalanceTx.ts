import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'
import { useV1ProjectTitle } from '../ProjectTitle'

export function useAddToBalanceTx(): TransactorInstance<{
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()

  return ({ value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.TicketBooth ||
      !terminal?.version
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'addToBalance',
      [BigNumber.from(projectId).toHexString()],
      {
        ...txOpts,
        value: value.toHexString(),
        title: t`Add to balance of ${projectTitle}`,
      },
    )
  }
}
