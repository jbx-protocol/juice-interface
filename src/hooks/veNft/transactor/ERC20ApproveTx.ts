import { BigNumber } from '@ethersproject/bignumber'

import { V2UserContext } from 'contexts/v2/userContext'
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
  const { transactor } = useContext(V2UserContext)
  const contract = useErc20Contract(erc20address)

  return ({ spender, amount }, txOpts) => {
    if (!transactor || !contract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(contract, 'approve', [spender, amount], {
      ...txOpts,
    })
  }
}
