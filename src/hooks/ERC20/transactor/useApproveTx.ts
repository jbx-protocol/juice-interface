import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { Contract } from 'ethers'
import {
  TransactorInstance,
  handleTransactionException,
} from 'hooks/useTransactor'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

export function useApproveERC20Tx(): TransactorInstance<{
  tokenContract: Contract
  amountWad: bigint
  senderAddress: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { cv } = useContext(V2V3ContractsContext)

  return ({ amountWad, senderAddress, tokenContract }, txOpts) => {
    try {
      invariant(transactor && senderAddress && amountWad && tokenContract)
      return transactor(tokenContract, 'approve', [senderAddress, amountWad], {
        ...txOpts,
        title: t`Approve tokens on ERC20 contract ${tokenContract.address}`,
      })
    } catch {
      return handleTransactionException({
        txOpts,
        missingParam: '',
        functionName: 'approve',
        cv,
      })
    }
  }
}
