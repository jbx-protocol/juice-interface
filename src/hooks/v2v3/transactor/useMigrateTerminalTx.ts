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

export function useMigrateETHPaymentTerminalTx(): TransactorInstance<{
  projectId: number | undefined
  newTerminalAddress: string | undefined
}> {
  const { transactor } = useContext(TransactionContext)
  const { cv } = useContext(V2V3ContractsContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)

  const { userAddress } = useJBWallet()

  return ({ projectId, newTerminalAddress }, txOpts) => {
    try {
      invariant(
        transactor &&
          userAddress &&
          projectId &&
          newTerminalAddress &&
          contracts?.JBETHPaymentTerminal,
      )
      return transactor(
        contracts.JBETHPaymentTerminal,
        'migrate',
        [
          projectId, // _projectId
          newTerminalAddress, // _to
        ],
        {
          ...txOpts,
          title: t`Migrate project's payment terminal`,
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
