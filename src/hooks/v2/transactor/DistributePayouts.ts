import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { V2CurrencyOption } from 'models/v2/currencyOption'

import { TransactorInstance } from '../../Transactor'

export type PayV2ProjectTxType = TransactorInstance<{
  memo?: string
  amount: BigNumber
  currency: V2CurrencyOption
}>

const minReturnedTokens = 0 // TODO will need a field for this in WithdrawModal for v2

export function useDistributePayoutsTx(): PayV2ProjectTxType {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ amount, currency, memo = '' }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.JBETHPaymentTerminal ||
      !amount ||
      !currency
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBPaymentTerminalStore,
      'distributePayoutsOf',
      [projectId, amount, currency, minReturnedTokens, memo],
      txOpts,
    )
  }
}
