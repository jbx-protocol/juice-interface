import { BigNumberish } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

import { useNFTContract } from '../VeNftContract'
import { VEBANNY_CONTRACT_ADDRESS } from 'constants/v2/nft/nftProject'

export type ExtendLockTx = TransactorInstance<{
  tokenId: number
  updatedDuration: BigNumberish
}>

export function useExtendLockTx(): ExtendLockTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useNFTContract(VEBANNY_CONTRACT_ADDRESS)

  return ({ tokenId, updatedDuration }, txOpts) => {
    if (!transactor || !nftContract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      nftContract,
      'extendLock',
      [[[tokenId, updatedDuration]]],
      {
        ...txOpts,
      },
    )
  }
}
