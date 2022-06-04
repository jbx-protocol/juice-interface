import { BigNumber } from '@ethersproject/bignumber'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { TransactorInstance } from 'hooks/Transactor'

import { useContext } from 'react'

import { VEBANNY_CONTRACT_ADDRESS } from 'constants/v2/nft/nftProject'

export type ERC20ApproveArgs = {
  value: BigNumber
}

export default function useERC20Approve(): TransactorInstance<ERC20ApproveArgs> {
  const { transactor } = useContext(V2UserContext)
  const { tokenAddress } = useContext(V2ProjectContext)
  const contract = useErc20Contract(tokenAddress)

  return ({ value }, txOpts) => {
    if (!transactor || !contract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(contract, 'approve', [VEBANNY_CONTRACT_ADDRESS, value], {
      ...txOpts,
    })
  }
}
