import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'

import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useContractReader } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { TransactorInstance } from 'hooks/Transactor'

import { useContext } from 'react'

export type ERC20ApproveArgs = {
  spender: string
  amount: BigNumber
}

export default function useERC20Approve(
  erc20address: string | undefined,
): TransactorInstance<ERC20ApproveArgs> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const contract = useErc20Contract(erc20address)

  const { data: symbol } = useContractReader({
    contract,
    contracts,
    functionName: 'symbol',
    args: [],
  })

  return ({ spender, amount }, txOpts) => {
    if (!transactor || !contract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(contract, 'approve', [spender, amount], {
      ...txOpts,
      title: symbol ? t`Approve $${symbol}` : t`Approve ERC20`,
    })
  }
}
