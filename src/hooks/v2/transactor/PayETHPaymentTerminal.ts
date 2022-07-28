import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TransactorInstance } from '../../Transactor'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

const DEFAULT_DELEGATE_METADATA = 0
const DEFAULT_MIN_RETURNED_TOKENS = 0 // TODO will need a field for this in V2ConfirmPayOwnerModal

type PayV2ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayETHPaymentTerminalTx(): PayV2ProjectTx {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ memo, preferClaimedTokens, beneficiary, value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.JBETHPaymentTerminal ||
      !beneficiary
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBETHPaymentTerminal,
      'pay',
      [
        projectId,
        value,
        ETH_TOKEN_ADDRESS,
        beneficiary,
        DEFAULT_MIN_RETURNED_TOKENS, // minReturnedTokens
        preferClaimedTokens, // _preferClaimedTokens
        memo || '',
        DEFAULT_DELEGATE_METADATA, //delegateMetadata
      ],
      {
        ...txOpts,
        value: value,
      },
    )
  }
}
