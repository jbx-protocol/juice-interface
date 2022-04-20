import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useTransferProjectOwnershipTx(): TransactorInstance<{
  newOwnerAddress: string // new owner address
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId, projectOwnerAddress } = useContext(V2ProjectContext)

  return ({ newOwnerAddress }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBProjects) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }
    return transactor(
      contracts.JBProjects,
      'safeTransferFrom(address,address,uint256)',
      [projectOwnerAddress, newOwnerAddress, projectId.toHexString()],
      txOpts,
    )
  }
}
