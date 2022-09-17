import { useContext } from 'react'

import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export type UnlockTx = TransactorInstance<{
  tokenId: number
  beneficiary: string
}>

export function useUnlockTx(): UnlockTx {
  const { transactor } = useContext(TransactionContext)
  const nftContract = useVeNftContract()

  return ({ tokenId, beneficiary }, txOpts) => {
    if (!transactor || !nftContract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(nftContract, 'unlock', [[{ tokenId, beneficiary }]], {
      ...txOpts,
      title: t`Unlock veNFT`,
    })
  }
}
