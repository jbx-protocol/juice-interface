import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'

import { TransactorInstance } from 'hooks/Transactor'

export function useEditV2ProjectDetailsTx(): TransactorInstance<{
  cid: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

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
