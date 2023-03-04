import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../ProjectTitle'

type DistributePayoutsTx = TransactorInstance<{
  memo?: string
  amount: BigNumber | undefined
  currency: V2V3CurrencyOption | undefined
}>

const DEFAULT_MIN_RETURNED_TOKENS = 0

export function useDistributePayoutsTx(): DistributePayoutsTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)
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
      [
        projectId,
        amount,
        currency,
        ETH_TOKEN_ADDRESS, // _token
        DEFAULT_MIN_RETURNED_TOKENS, // _minReturnedTokens
        memo,
      ],
      {
        ...txOpts,
        title: t`Send ${projectTitle} payouts`,
      },
    )
  }
}
