import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

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
  const nftContract = useVeNftContract(VENFT_CONTRACT_ADDRESS)

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
