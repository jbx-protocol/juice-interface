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
import { useJBV3TokenDeployer } from '../contracts/JBV3TokenDeployer'

export function useSetChangeTokenPermissionTx(): TransactorInstance {
  const { transactor } = useContext(TransactionContext)
  const { contracts, cv } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()
  const deployer = useJBV3TokenDeployer()

  return (_, txOpts) => {
    try {
      invariant(transactor && userAddress && projectId && deployer && contracts)
      return transactor(
        contracts.JBOperatorStore,
        'setOperator',
        [
          {
            operator: deployer?.address,
            domain: projectId,
            permissionIndexes: [V2OperatorPermission.CHANGE_TOKEN],
          },
        ],
        {
          ...txOpts,
          title: t`Give V3 migration token deployer permissions on project #${projectId}`,
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
