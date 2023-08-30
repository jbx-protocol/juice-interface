import { t } from '@lingui/macro'
import {
  DEFAULT_MEMO,
  DEFAULT_METADATA,
  DEFAULT_MIN_RETURNED_TOKENS,
} from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import { PaymentTerminalVersion, V2V3ContractName } from 'models/v2v3/contracts'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext } from 'react'
import invariant from 'tiny-invariant'
import { useV2ProjectTitle } from '../useProjectTitle'

interface DistributePayoutsTxBaseParams {
  amount: BigNumber | undefined
  currency: V2V3CurrencyOption | undefined
}

type DISTRIBUTE_PAYOUTS_TX_V3_PARAMS = DistributePayoutsTxBaseParams & {
  memo?: string
}

type DISTRIBUTE_PAYOUTS_TX_V3_1_PARAMS = DistributePayoutsTxBaseParams & {
  metadata?: string // JB terminal 3.1 replaced `memo` with `metadata`
}

type DistributePayoutsTxArgs =
  | DISTRIBUTE_PAYOUTS_TX_V3_PARAMS
  | DISTRIBUTE_PAYOUTS_TX_V3_1_PARAMS

type DistributePayoutsTx = TransactorInstance<DistributePayoutsTxArgs>

/**
 * Factory function for building the arguments for the `distributePayoutsOf` function, depending on the version of the JBETHPaymentTerminal contract.
 */
function buildTxArgs({
  JBETHPaymentTerminalVersion,
  projectId,
  args,
}: {
  JBETHPaymentTerminalVersion: PaymentTerminalVersion | undefined
  projectId: number
  args: DistributePayoutsTxArgs
}) {
  const baseArgs = [
    projectId,
    args.amount,
    args.currency,
    ETH_TOKEN_ADDRESS, // _token
    DEFAULT_MIN_RETURNED_TOKENS, // _minReturnedTokens
  ]

  if (JBETHPaymentTerminalVersion === V2V3ContractName.JBETHPaymentTerminal) {
    return [
      ...baseArgs,
      (args as DISTRIBUTE_PAYOUTS_TX_V3_PARAMS).memo ?? DEFAULT_MEMO, // _memo
    ]
  }

  if (
    JBETHPaymentTerminalVersion === V2V3ContractName.JBETHPaymentTerminal3_1
  ) {
    return [
      ...baseArgs,
      (args as DISTRIBUTE_PAYOUTS_TX_V3_1_PARAMS).metadata ?? DEFAULT_METADATA, // _metadata
    ]
  }

  // no changes between 3.1.1 and 3.1.2
  if (
    JBETHPaymentTerminalVersion ===
      V2V3ContractName.JBETHPaymentTerminal3_1_1 ||
    JBETHPaymentTerminalVersion === V2V3ContractName.JBETHPaymentTerminal3_1_2
  ) {
    return [
      ...baseArgs,
      (args as DISTRIBUTE_PAYOUTS_TX_V3_1_PARAMS).metadata ?? DEFAULT_METADATA, // _metadata
    ]
  }

  throw new Error(
    'JBM does not support Distribute Payouts for this terminal version yet.',
  )
}

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

    const txArgs = buildTxArgs({
      JBETHPaymentTerminalVersion: versions.JBETHPaymentTerminalVersion,
      projectId,
      args,
    })

    invariant(txArgs)

    return transactor(
      contracts.JBETHPaymentTerminal,
      'distributePayoutsOf',
      txArgs,
      {
        ...txOpts,
        title: t`Send ${projectTitle} payouts`,
      },
    )
  }
}
