import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

import { useNFTContract } from '../VeNftContract'
import { VENFT_CONTRACT_ADDRESS } from 'constants/v2/veNft/veNftProject'

export type UnlockTx = TransactorInstance<{
  tokenId: number
  beneficiary: string
}>

export function useUnlockTx(): UnlockTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useNFTContract(VENFT_CONTRACT_ADDRESS)

  return ({ tokenId, beneficiary }, txOpts) => {
    if (!transactor || !nftContract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(nftContract, 'unlock', [[{ tokenId, beneficiary }]], {
      ...txOpts,
    })
  }
}
