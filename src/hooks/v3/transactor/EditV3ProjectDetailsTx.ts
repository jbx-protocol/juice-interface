import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'
import { useContext } from 'react'

import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/metadataDomain'

import { TransactorInstance } from 'hooks/Transactor'

export function useEditV3ProjectDetailsTx(): TransactorInstance<{
  cid: string
}> {
  const { transactor, contracts } = useContext(V3UserContext)
  const { projectId } = useContext(V3ProjectContext)

  return ({ cid }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBProjects) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBProjects,
      'setMetadataOf',
      [projectId, [cid, JUICEBOX_MONEY_METADATA_DOMAIN]],
      txOpts,
    )
  }
}
