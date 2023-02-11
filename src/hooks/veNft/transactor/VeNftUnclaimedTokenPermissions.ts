import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { VeNftContext } from 'contexts/VeNft/VeNftContext'
import { useV2ProjectTitle } from 'hooks/v2v3/ProjectTitle'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'

export function useUnclaimedTokensPermissionTx(): TransactorInstance {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { contractAddress } = useContext(VeNftContext)

  const projectTitle = useV2ProjectTitle()

  const permissionIndexes = [V2V3OperatorPermission.TRANSFER] // TRANSFER permission, https://github.com/jbx-protocol/juice-contracts-v2/blob/main/contracts/libraries/JBOperations.sol

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
