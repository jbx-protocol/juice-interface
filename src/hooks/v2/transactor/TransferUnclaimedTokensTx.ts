import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useTransferUnclaimedTokensTx(): TransactorInstance<{
  amount: BigNumber
  to: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { tokenSymbol } = useContext(V2ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()

  return ({ amount, to }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBTokenStore) {
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
        : null

      txOpts?.onError?.(
        new DOMException(
          `Missing ${
            missingParam ?? 'parameter` not found'
          } in v2 TransferUnclaimedTokensTx`,
        ),
      )

      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

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
  }
}
