import { NetworkContext } from 'contexts/networkContext'
import { BigNumber } from '@ethersproject/bignumber'
import { randomBytes } from '@ethersproject/random'
import { useContext } from 'react'

import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { TransactorInstance } from '../../Transactor'

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minReturnedTokens: BigNumber
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ redeemAmount, minReturnedTokens }, txOpts) => {
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
        userAddress, // _holder
        projectId, // _projectId
        redeemAmount, // _tokenCount, tokens to redeem
        minReturnedTokens, // _minReturnedTokens, min amount of ETH to receive
        userAddress, // _beneficiary
        memo, // _memo
        randomBytes(1), // _metadata, TODO: metadata
      ],
      txOpts,
    )
  }
}
