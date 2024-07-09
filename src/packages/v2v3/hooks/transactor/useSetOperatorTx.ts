import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { Contract } from 'ethers'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import type { V2V3OperatorPermission } from 'packages/v2v3/models/v2v3Permissions'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { truncateEthAddress } from 'utils/format/formatAddress'

export function useSetOperatorTx(): TransactorInstance<{
  operatorAddress: string | undefined
  permissionIndexes: V2V3OperatorPermission[]
  contractOverride?: Contract
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts, cv } = useContext(V2V3ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  return ({ operatorAddress, permissionIndexes, contractOverride }, txOpts) => {
    try {
      invariant(
        transactor && userAddress && projectId && operatorAddress && contracts,
      )
      return transactor(
        contractOverride ?? contracts.JBOperatorStore,
        'setOperator',
        [
          {
            operator: operatorAddress,
            domain: projectId,
            permissionIndexes,
          },
        ],
        {
          ...txOpts,
          title: t`Give permissions to ${truncateEthAddress({
            address: operatorAddress,
          })} on project #${projectId}`,
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
