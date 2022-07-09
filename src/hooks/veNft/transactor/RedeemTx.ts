import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

import { useNFTContract } from '../VeNftContract'
import { VENFT_CONTRACT_ADDRESS } from 'constants/v2/veNft/veNftProject'

export type RedeemVeNftTx = TransactorInstance<{
  tokenId: number
  token: string
  beneficiary: string
  memo: string
  terminal: string
}>

export function useRedeemVeNftTx(): RedeemVeNftTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useNFTContract(VENFT_CONTRACT_ADDRESS)
  const minReturnedTokens = 0 // TODO will need a field for this in V2ConfirmPayOwnerModal
  const bytes = '' //randomBytes(1)

  return ({ tokenId, token, beneficiary, memo, terminal }, txOpts) => {
    if (!transactor || !nftContract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      nftContract,
      'redeem',
      [
        [
          {
            tokenId,
            token,
            minReturnedTokens,
            beneficiary,
            memo,
            bytes,
            terminal,
          },
        ],
      ],
      {
        ...txOpts,
        value: BigNumber.from(1),
      },
    )
  }
}
