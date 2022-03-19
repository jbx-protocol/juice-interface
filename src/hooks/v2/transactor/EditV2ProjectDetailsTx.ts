import { PEEL_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useEditV2ProjectDetailsTx(): TransactorInstance<{
  cid: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ cid }, txOpts) => {
    console.log('projectId: ', projectId)
    console.log('cid: ', cid)
    const METADATA_CID_2 = 'ipfs://randommetadatacidipsaddress'
    const METADATA_DOMAIN_2 = 23435
    if (!transactor || !projectId || !contracts?.JBProjects) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBProjects,
      'setMetadataOf',
      [projectId.toHexString(), [cid, PEEL_METADATA_DOMAIN]],
      // [1, [METADATA_CID_2, METADATA_DOMAIN_2]],
      txOpts,
    )
  }
}
