import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export type ExtendLockTx = TransactorInstance<{
  tokenId: number
  updatedDuration: number
}>

export function useExtendLockTx(): ExtendLockTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useVeNftContract()

  return ({ tokenId, updatedDuration }, txOpts) => {
    if (!transactor || !nftContract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      nftContract,
      'extendLock',
      [[{ tokenId, updatedDuration }]],
      {
        ...txOpts,
      },
    )
  }
}
