import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'
import { V1UserContext } from 'packages/v1/contexts/User/V1UserContext'
import { useContext } from 'react'
import { toHexString } from 'utils/bigNumbers'
import { useV1ProjectTitle } from '../useProjectTitle'

export function useSetProjectUriTx(): TransactorInstance<{
  cid: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()

  return ({ cid }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'setUri',
      [toHexString(BigInt(projectId)), cid],
      {
        ...txOpts,
        title: t`Set URI for ${projectTitle}`,
      },
    )
  }
}
