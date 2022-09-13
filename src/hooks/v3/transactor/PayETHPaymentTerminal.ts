import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { TransactorInstance } from 'hooks/Transactor'

const DEFAULT_DELEGATE_METADATA = 0
const DEFAULT_MIN_RETURNED_TOKENS = 0 // TODO will need a field for this in V2ConfirmPayOwnerModal

type PayV3ProjectTx = TransactorInstance<{
  memo: string
  preferClaimedTokens: boolean
  beneficiary?: string
  value: BigNumber
}>

export function usePayETHPaymentTerminalTx(): PayV3ProjectTx {
  const { transactor, contracts } = useContext(V3UserContext)
  const { projectId } = useContext(V3ProjectContext)

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
