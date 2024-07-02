import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'
import { useContext } from 'react'
import { toHexString } from 'utils/bigNumbers'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useAddToBalanceTx(): TransactorInstance<{
  value: bigint
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
      [toHexString(BigInt(projectId))],
      {
        ...txOpts,
        value: toHexString(value),
        title: t`Transfer ETH to ${projectTitle}`,
      },
    )
  }
}
