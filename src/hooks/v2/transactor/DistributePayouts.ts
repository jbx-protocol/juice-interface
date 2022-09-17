import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { V2CurrencyOption } from 'models/v2/currencyOption'

import { t } from '@lingui/macro'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

type DistributePayoutsTx = TransactorInstance<{
  memo?: string
  amount: BigNumber | undefined
  currency: V2CurrencyOption | undefined
}>

const minReturnedTokens = 0 // TODO will need a field for this in WithdrawModal for v2

export function useDistributePayoutsTx(): DistributePayoutsTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2ContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

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
      contracts.JBETHPaymentTerminal,
      'distributePayoutsOf',
      [projectId, amount, currency, ETH_TOKEN_ADDRESS, minReturnedTokens, memo],
      {
        ...txOpts,
        title: t`Distribute payouts of ${projectTitle}`,
      },
    )
  }
}
