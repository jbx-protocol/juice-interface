import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

import { useNFTContract } from '../VeNftContract'
import { VEBANNY_CONTRACT_ADDRESS } from 'constants/v2/nft/nftProject'

export type LockTx = TransactorInstance<{
  account: string
  value: BigNumber
  lockDuration: BigNumberish
  beneficiary: string
  useJbToken: boolean
  allowPublicExtension: boolean
}>

export function useLockTx(): LockTx {
  const { transactor } = useContext(V2UserContext)
  const nftContract = useNFTContract(VEBANNY_CONTRACT_ADDRESS)

  return (
    {
      account,
      value,
      lockDuration,
      beneficiary,
      useJbToken,
      allowPublicExtension,
    },
    txOpts,
  ) => {
    if (!transactor || !nftContract) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      nftContract,
      'lock',
      [
        account,
        value,
        lockDuration,
        beneficiary,
        useJbToken,
        allowPublicExtension,
      ],
      {
        ...txOpts,
      },
    )
  }
}
