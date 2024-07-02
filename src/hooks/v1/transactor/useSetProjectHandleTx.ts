import { V1UserContext } from 'contexts/v1/User/V1UserContext'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { ethers } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import { toHexString } from 'utils/bigNumbers'

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
      [toHexString(BigInt(projectId)), ethers.encodeBytes32String(handle)],
      {
        ...txOpts,
        title: t`Set handle @${handle}`,
      },
    )
  }
}
