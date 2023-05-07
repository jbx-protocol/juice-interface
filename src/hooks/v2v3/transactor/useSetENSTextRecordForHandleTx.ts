import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { namehash } from 'ethers/lib/utils'
import { TransactorInstance } from 'hooks/useTransactor'
import { useContext } from 'react'

import { useResolverForENS } from '../useENSResolver'

export function useSetENSTextRecordForHandleTx(
  ensName: string | undefined,
): TransactorInstance<{
  ensName: string
  key: string
  value: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const Resolver = useResolverForENS(ensName)

  return ({ ensName, key, value }, txOpts) => {
    if (!transactor || !projectId || !Resolver) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const node = namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))

    return transactor(Resolver, 'setText', [node, key, value], {
      ...txOpts,
      title: t`Set ENS text record for ${ensName}`,
    })
  }
}
