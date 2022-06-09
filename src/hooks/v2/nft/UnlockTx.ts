import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

import { useNFTContract } from './NFTContract'
import { VEBANNY_CONTRACT_ADDRESS } from 'constants/v2/nft/nftProject'

export type UnlockTx = TransactorInstance<{
  tokenId: number
  beneficiary: string
}>

export function useUnlockTx(): UnlockTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useNFTContract(VEBANNY_CONTRACT_ADDRESS)

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
