import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'
import invariant from 'tiny-invariant'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function useTransferUnclaimedTokensTx(): TransactorInstance<{
  amount: BigNumber
  to: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
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
        pv: PV_V2,
      })
    }
  }
}
