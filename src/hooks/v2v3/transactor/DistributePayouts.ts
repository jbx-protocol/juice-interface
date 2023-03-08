import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import {
  DEFAULT_MEMO,
  DEFAULT_METADATA,
  DEFAULT_MIN_RETURNED_TOKENS,
} from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import { useV2ProjectTitle } from '../ProjectTitle'
import { ETH_PAYMENT_TERMINAL_V_3 } from '../V2V3ProjectContracts/projectContractLoaders/ProjectPrimaryEthTerminal'

interface DistributePayoutsTxBaseParams {
  amount: BigNumber | undefined
  currency: V2V3CurrencyOption | undefined
}

type DistributePayoutsTx3Params = DistributePayoutsTxBaseParams & {
  memo?: string
}

// eslint-disable-next-line @typescript-eslint/naming-convention
type DistributePayoutsTx3_1Params = DistributePayoutsTxBaseParams & {
  metadata?: string
}

type DistributePayoutsTx = TransactorInstance<
  DistributePayoutsTx3Params | DistributePayoutsTx3_1Params
>

export function useDistributePayoutsTx(): DistributePayoutsTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts, versions } = useContext(V2V3ProjectContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const projectTitle = useV2ProjectTitle()

  return (args, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.JBETHPaymentTerminal ||
      !args.amount ||
      !args.currency
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBETHPaymentTerminal,
      'distributePayoutsOf',
      [
        projectId,
        args.amount,
        args.currency,
        ETH_TOKEN_ADDRESS, // _token
        DEFAULT_MIN_RETURNED_TOKENS, // _minReturnedTokens
        versions.JBETHPaymentTerminal === ETH_PAYMENT_TERMINAL_V_3
          ? (args as DistributePayoutsTx3Params).memo ?? DEFAULT_MEMO
          : (args as DistributePayoutsTx3_1Params).metadata ?? DEFAULT_METADATA, // _metadata
      ],
      {
        ...txOpts,
        title: t`Send ${projectTitle} payouts`,
      },
    )
  }
}
