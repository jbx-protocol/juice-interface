import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { useJBWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

export function useMigrateControllerTx(): TransactorInstance<{
  projectId: number | undefined
  newControllerAddress: string | undefined
}> {
  const { transactor } = useContext(TransactionContext)
  const { cv } = useContext(V2V3ContractsContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)

  const { userAddress } = useJBWallet()

  return ({ projectId, newControllerAddress }, txOpts) => {
    try {
      invariant(
        transactor &&
          userAddress &&
          projectId &&
          newControllerAddress &&
          contracts?.JBController,
      )
      return transactor(
        contracts.JBController,
        'migrate',
        [
          projectId, // _projectId
          newControllerAddress, // _to
        ],
        {
          ...txOpts,
          title: t`Migrate project's Controller`,
        },
      )
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
