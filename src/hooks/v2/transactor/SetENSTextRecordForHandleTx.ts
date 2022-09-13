import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { namehash } from 'ethers/lib/utils'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useSetENSTextRecordForHandleTx(): TransactorInstance<{
  ensName: string
  key: string
  value: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ ensName, key, value }, txOpts) => {
    if (!transactor || !projectId || !contracts?.PublicResolver) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const node = namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))

    return transactor(
      contracts.PublicResolver,
      'setText',
      [node, key, value],
      txOpts,
    )
  }
}
