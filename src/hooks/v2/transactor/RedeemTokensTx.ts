import { NetworkContext } from 'contexts/networkContext'
import { BigNumber } from '@ethersproject/bignumber'
import { randomBytes } from '@ethersproject/random'
import { useContext } from 'react'

import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { TransactorInstance } from '../../Transactor'

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minAmount: BigNumber
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ redeemAmount, minAmount }, txOpts) => {
    if (
      !transactor ||
      !userAddress ||
      !projectId ||
      !contracts?.JBETHPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const memo = '' //TODO: memo field on V2RedeemModal

    return transactor(
      contracts?.JBETHPaymentTerminal,
      'redeemTokensOf',
      [
        userAddress,
        projectId,
        redeemAmount, // tokens to redeem
        minAmount, // min amount of ETH to receive
        userAddress, // beneficiary
        memo,
        randomBytes(1), // TODO: metadata
      ],
      txOpts,
    )
  }
}
