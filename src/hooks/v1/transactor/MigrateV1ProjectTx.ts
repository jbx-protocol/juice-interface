import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV1ProjectTitle } from '../ProjectTitle'

export function useMigrateV1ProjectTx(): TransactorInstance<{
  newTerminalAddress: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV1ProjectTitle()

  return ({ newTerminalAddress }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TerminalV1,
      'migrate',
      [BigNumber.from(projectId).toHexString(), newTerminalAddress],
      {
        ...txOpts,
        title: t`Migrate ${projectTitle}`,
      },
    )
  }
}
