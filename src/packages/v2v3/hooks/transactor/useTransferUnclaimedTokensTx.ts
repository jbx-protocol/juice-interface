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
import { toHexString } from 'utils/bigNumbers'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useTransferUnclaimedTokensTx(): TransactorInstance<{
  amount: bigint
  to: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts, cv } = useContext(V2V3ContractsContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  return ({ amount, to }, txOpts) => {
    try {
      invariant(transactor && projectId && contracts?.JBTokenStore)
      return transactor(
        contracts.JBTokenStore,
        'transferFrom',
        [userAddress, projectId, to, toHexString(amount)],
        {
          ...txOpts,
          title: t`Transfer unclaimed ${tokenSymbolText({
            tokenSymbol,
            plural: true,
          })}`,
        },
      )
    } catch {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.JBTokenStore
        ? 'contracts.JBTokenStore'
        : !amount
        ? 'amount'
        : !to
        ? 'to'
        : undefined

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'transferFrom',
        cv,
      })
    }
  }
}
