import { V2UserContext } from 'contexts/v2/userContext'
import { namehash } from 'ethers/lib/utils'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactorInstance } from 'hooks/Transactor'

export function useSetENSTextRecordForHandleTx(): TransactorInstance<{
  ensName: string
  key: string
  value: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
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
