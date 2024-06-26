import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { useJBV3Token } from '../contracts/useJBV3Token'

export function useMigrateTokensTx(): TransactorInstance {
  const { transactor } = useContext(TransactionContext)
  const { tokenAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { cv } = useContext(V2V3ContractsContext)

  const { userAddress } = useWallet()
  const tokenContract = useJBV3Token({ tokenAddress })

  return (_, txOpts) => {
    try {
      invariant(transactor && userAddress && projectId && tokenContract)
      return transactor(tokenContract, 'migrate', [], {
        ...txOpts,
        title: t`Migrate tokens to V3 for project #${projectId}`,
      })
    } catch {
      return handleTransactionException({
        txOpts,
        missingParam: '',
        functionName: 'migrate',
        cv,
      })
    }
  }
}
