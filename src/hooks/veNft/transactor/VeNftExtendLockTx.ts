import { useContext } from 'react'

import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export type ExtendLockTx = TransactorInstance<{
  tokenId: number
  updatedDuration: number
}>

export function useExtendLockTx(): ExtendLockTx {
  const { transactor } = useContext(TransactionContext)
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
        title: t`Extend veNFT lock`,
      },
    )
  }
}
