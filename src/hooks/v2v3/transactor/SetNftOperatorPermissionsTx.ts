import { getAddress } from '@ethersproject/address'
import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'
import { useWallet } from 'hooks/Wallet'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

export function useSetNftOperatorPermissionsTx(): TransactorInstance {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { cv } = useContext(V2V3ContractsContext)

  const { userAddress } = useWallet()

  return (_, txOpts) => {
    try {
      invariant(transactor && userAddress && projectId && contracts)
      return transactor(
        contracts.JBOperatorStore,
        'setOperator',
        [
          {
            operator: getAddress(
              contracts?.JBTiered721DelegateProjectDeployer.address,
            ),
            domain: projectId,
            permissionIndexes: [V2OperatorPermission.RECONFIGURE],
          },
        ],
        {
          ...txOpts,
          title: t`Give NFT deployer permissions for project #${projectId}`,
        },
      )
    } catch {
      return handleTransactionException({
        txOpts,
        missingParam: '',
        functionName: 'setOperator',
        cv,
      })
    }
  }
}
