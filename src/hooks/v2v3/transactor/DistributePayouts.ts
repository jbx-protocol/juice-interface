import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'

import { t } from '@lingui/macro'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useV2ProjectTitle } from '../ProjectTitle'

type DistributePayoutsTx = TransactorInstance<{
  memo?: string
  amount: BigNumber | undefined
  currency: V2V3CurrencyOption | undefined
}>

const minReturnedTokens = 0 // TODO will need a field for this in WithdrawModal for v2

export function useDistributePayoutsTx(): DistributePayoutsTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
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
