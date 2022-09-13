import { BigNumber } from '@ethersproject/bignumber'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export type RedeemVeNftTx = TransactorInstance<{
  tokenId: number
  token: string
  beneficiary: string
  memo: string
  terminal: string
}>

export function useRedeemVeNftTx(): RedeemVeNftTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useVeNftContract()
  const minReturnedTokens = BigNumber.from(0) // TODO will need a field for this in V2ConfirmPayOwnerModal
  const metadata: string[] = [] //randomBytes(1)

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
            metadata,
            terminal,
          },
        ],
      ],
      {
        ...txOpts,
      },
    )
  }
}
