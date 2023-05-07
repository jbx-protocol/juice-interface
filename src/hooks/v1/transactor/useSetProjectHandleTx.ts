import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { formatBytes32String } from 'ethers/lib/utils'
import { useContext } from 'react'

import { BigNumber } from 'ethers'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactorInstance } from 'hooks/useTransactor'

export function useSetProjectHandleTx(): TransactorInstance<{
  handle: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ handle }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'setHandle',
      [BigNumber.from(projectId).toHexString(), formatBytes32String(handle)],
      {
        ...txOpts,
        title: t`Set handle @${handle}`,
      },
    )
  }
}
