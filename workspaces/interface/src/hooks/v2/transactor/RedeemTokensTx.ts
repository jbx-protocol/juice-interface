import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

const DEFAULT_METADATA = 0

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minReturnedTokens: BigNumber
  memo: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(V2ProjectContext)

  return ({ redeemAmount, minReturnedTokens, memo }, txOpts) => {
    if (
      !transactor ||
      !userAddress ||
      !projectId ||
      !contracts?.JBETHPaymentTerminal
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts?.JBETHPaymentTerminal,
      'redeemTokensOf',
      [
        userAddress, // _holder
        projectId, // _projectId
        redeemAmount, // _tokenCount, tokens to redeem
        constants.AddressZero, // _token, unused parameter
        minReturnedTokens, // _minReturnedTokens, min amount of ETH to receive
        userAddress, // _beneficiary
        memo, // _memo
        DEFAULT_METADATA, // _metadata, TODO: metadata
      ],
      txOpts,
    )
  }
}
