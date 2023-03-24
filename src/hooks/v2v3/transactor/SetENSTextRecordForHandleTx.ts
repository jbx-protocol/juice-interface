import { namehash } from 'ethers/lib/utils'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { usePublicResolver } from 'hooks/PublicResolver/contracts/PublicResolver'
import { TransactorInstance } from 'hooks/Transactor'

export function useSetENSTextRecordForHandleTx(): TransactorInstance<{
  ensName: string
  key: string
  value: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const PublicResolver = usePublicResolver()

  return ({ ensName, key, value }, txOpts) => {
    if (!transactor || !projectId || !PublicResolver) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const node = namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))

    return transactor(PublicResolver, 'setText', [node, key, value], {
      ...txOpts,
      title: t`Set ENS text record for ${ensName}`,
    })
  }
}
