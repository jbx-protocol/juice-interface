import { useAccount } from 'wagmi'
import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { useContext } from 'react'

import { V2UserContext } from 'contexts/v2/userContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { TransactorInstance } from '../../Transactor'

const DEFAULT_METADATA = 0

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minReturnedTokens: BigNumber
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { address: userAddress } = useAccount()
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
