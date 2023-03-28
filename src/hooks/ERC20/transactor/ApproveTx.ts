import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

export function useApproveERC20Tx(): TransactorInstance<{
  tokenContract: Contract
  amountWad: BigNumber
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
