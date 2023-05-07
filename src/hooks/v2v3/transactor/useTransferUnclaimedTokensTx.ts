import { t } from '@lingui/macro'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/useTransactor'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useTransferUnclaimedTokensTx(): TransactorInstance<{
  amount: BigNumber
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
        [userAddress, projectId, to, amount.toHexString()],
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
