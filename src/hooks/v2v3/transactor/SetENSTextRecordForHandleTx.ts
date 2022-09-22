import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { namehash } from 'ethers/lib/utils'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'

export function useSetENSTextRecordForHandleTx(): TransactorInstance<{
  ensName: string
  key: string
  value: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ ensName, key, value }, txOpts) => {
    if (!transactor || !projectId || !contracts?.PublicResolver) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const node = namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))

    return transactor(contracts.PublicResolver, 'setText', [node, key, value], {
      ...txOpts,
      title: t`Set ENS text record for ${ensName}`,
    })
  }
}
