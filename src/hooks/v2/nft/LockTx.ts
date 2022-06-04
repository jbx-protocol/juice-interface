import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

import { useNFTContract } from './NFTContract'
import { VEBANNY_CONTRACT_ADDRESS } from 'constants/v2/nft/nftProject'

export type LockTx = TransactorInstance<{
  value: BigNumber
  lockDuration: BigNumberish
  beneficiary: string
}>

export function useLockTx(): LockTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useNFTContract(VEBANNY_CONTRACT_ADDRESS)

  return ({ value, lockDuration, beneficiary }, txOpts) => {
    if (!transactor || !nftContract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      nftContract,
      'lock',
      [beneficiary, value, lockDuration, beneficiary, true, false],
      {
        ...txOpts,
      },
    )
  }
}
