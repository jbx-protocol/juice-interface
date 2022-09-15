import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { TransactorInstance } from 'hooks/Transactor'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export type UnlockTx = TransactorInstance<{
  tokenId: number
  beneficiary: string
}>

export function useUnlockTx(): UnlockTx {
  const { transactor } = useContext(V2UserContext)
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
