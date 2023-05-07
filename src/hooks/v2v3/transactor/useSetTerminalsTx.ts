import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useWallet } from 'hooks/Wallet'
import {
  TransactorInstance,
  handleTransactionException,
} from 'hooks/useTransactor'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

export function useSetTerminalsTx(): TransactorInstance<{
  projectId: number | undefined
  newTerminalAddress: string | undefined
}> {
  const { transactor } = useContext(TransactionContext)
  const { cv, contracts } = useContext(V2V3ContractsContext)

  const { userAddress } = useWallet()

  return ({ projectId, newTerminalAddress }, txOpts) => {
    try {
      invariant(
        transactor &&
          userAddress &&
          projectId &&
          newTerminalAddress &&
          contracts?.JBDirectory,
      )
      return transactor(
        contracts.JBDirectory,
        'setTerminalsOf',
        [
          projectId, // _projectId
          [newTerminalAddress],
        ],
        {
          ...txOpts,
          title: t`Set project's payment terminals`,
        },
      )
    } catch {
      return handleTransactionException({
        txOpts,
        missingParam: '',
        functionName: 'setTerminalsOf',
        cv,
      })
    }
  }
}
