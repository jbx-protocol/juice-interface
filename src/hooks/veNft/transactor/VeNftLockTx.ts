import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { useContext } from 'react'

import { t } from '@lingui/macro'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export type LockTx = TransactorInstance<{
  account: string
  value: BigNumber
  lockDuration: BigNumberish
  beneficiary: string
  useJbToken: boolean
  allowPublicExtension: boolean
}>

export function useLockTx(): LockTx {
  const { transactor } = useContext(TransactionContext)
  const nftContract = useVeNftContract()

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
        title: t`Lock veNFT`,
      },
    )
  }
}
