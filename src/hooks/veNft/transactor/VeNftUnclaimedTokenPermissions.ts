import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { VeNftContext } from 'contexts/veNftContext'
import { useV2ProjectTitle } from 'hooks/v2/ProjectTitle'
import { V2OperatorPermission } from 'models/v2/permissions'

export function useUnclaimedTokensPermissionTx(): TransactorInstance {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { contractAddress } = useContext(VeNftContext)

  const projectTitle = useV2ProjectTitle()

  const permissionIndexes = [V2OperatorPermission.TRANSFER] // TRANSFER permission, https://github.com/jbx-protocol/juice-contracts-v2/blob/main/contracts/libraries/JBOperations.sol

  return (_, txOpts) => {
    if (!transactor || !contracts || !projectId || !contractAddress) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBOperatorStore,
      'setOperator',
      [{ operator: contractAddress, domain: projectId, permissionIndexes }],
      {
        ...txOpts,
        title: t`Set veNFT operator for ${projectTitle}`,
      },
    )
  }
}
