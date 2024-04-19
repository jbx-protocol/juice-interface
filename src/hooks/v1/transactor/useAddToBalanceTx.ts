import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { TransactorInstance } from 'hooks/useTransactor'
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
