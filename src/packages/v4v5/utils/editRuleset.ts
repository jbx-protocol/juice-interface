import { ETH_CURRENCY_ID, JBChainId, NATIVE_TOKEN } from 'juice-sdk-core'

import round from 'lodash/round'
import { issuanceRateFrom } from 'packages/v2v3/utils/math'
import { isZeroAddress } from 'utils/address'
import { parseWad } from 'utils/format/formatNumber'
import { otherUnitToSeconds } from 'utils/format/formatTime'
import { EditCycleFormFields } from '../views/V4V5ProjectSettings/EditCyclePage/EditCycleFormFields'
import { getApprovalStrategyByAddress } from './approvalHooks'
import { MAX_PAYOUT_LIMIT } from './math'

export type EditCycleTxArgs = readonly [
  projectId: bigint,
  rulesetConfigurations: {
    mustStartAtOrAfter: number
    duration: number
    weight: bigint
    weightCutPercent: number
    approvalHook: `0x${string}`
    metadata: {
      reservedPercent: number
      cashOutTaxRate: number
      baseCurrency: number
      pausePay: boolean
      pauseRedeem: boolean
      pauseCreditTransfers: boolean
      allowOwnerMinting: boolean
      allowSetCustomToken: boolean
      allowTerminalMigration: boolean
      allowSetTerminals: boolean
      allowSetController: boolean
      allowAddAccountingContext: boolean
      allowAddPriceFeed: boolean
      ownerMustSendPayouts: boolean
      holdFees: boolean
      useTotalSurplusForCashOuts: boolean
      useDataHookForPay: boolean
      useDataHookForCashOut: boolean
      dataHook: `0x${string}`
      metadata: number
      allowCrosschainSuckerExtension: boolean
    }
    splitGroups: {
      groupId: bigint
      splits: {
        preferAddToBalance: boolean
        percent: number
        projectId: bigint
        beneficiary: `0x${string}`
        lockedUntil: number
        hook: `0x${string}`
      }[]
    }[]
    fundAccessLimitGroups: {
      terminal: `0x${string}`
      token: `0x${string}`
      payoutLimits: {
        amount: bigint
        currency: number
      }[]
      surplusAllowances: {
        amount: bigint
        currency: number
      }[]
    }[]
  }[],
  memo: string,
]

export function transformEditCycleFormFieldsToTxArgs({
  formValues,
  primaryNativeTerminal,
  tokenAddress,
  dataHook,
  projectId,
  chainId,
  version,
}: {
  formValues: EditCycleFormFields
  primaryNativeTerminal: `0x${string}`
  tokenAddress: `0x${string}`
  dataHook: `0x${string}`
  projectId: bigint
  chainId: JBChainId
  version: 4 | 5
}): EditCycleTxArgs {
  const now = round(new Date().getTime() / 1000)

  // Use custom mustStartAtOrAfter if provided (for Safe projects), otherwise default to now + 5 minutes
  // allow for different chains taking different times to process the tx
  const mustStartAtOrAfter = formValues.mustStartAtOrAfter ?? now + 5 * 60
  const duration = otherUnitToSeconds({
    duration: formValues.duration,
    unit: formValues.durationUnit.value,
  })
  const weight = BigInt(issuanceRateFrom(formValues.issuanceRate.toString()))
  const weightCutPercent = round(formValues.weightCutPercent * 10000000)

  // Get the chain-specific approval hook address
  // The form stores one address, but we need to get the equivalent address for the target chain
  const approvalHookStrategy = getApprovalStrategyByAddress(
    formValues.approvalHook,
    version,
    chainId,
  )
  const approvalHook = approvalHookStrategy.address as `0x${string}`

  // Calculate metadata flags
  const useDataHookForPayValue = Boolean(dataHook) && !isZeroAddress(dataHook)

  const rulesetConfigurations = [
    {
      mustStartAtOrAfter,
      duration,
      weight,
      weightCutPercent,
      approvalHook,

      metadata: {
        reservedPercent: formValues.reservedPercent * 100,
        cashOutTaxRate: formValues.cashOutTaxRate * 100,
        baseCurrency: ETH_CURRENCY_ID,
        pausePay: formValues.pausePay,
        pauseRedeem: false, // Defaulting this value since it's not in formValues
        pauseCreditTransfers: !formValues.tokenTransfers,
        allowOwnerMinting: formValues.allowOwnerMinting,
        allowSetCustomToken: false, // Defaulting to false as it's not in formValues
        allowTerminalMigration: formValues.allowTerminalMigration,
        allowSetTerminals: formValues.allowSetTerminals,
        allowSetController: formValues.allowSetController,
        allowAddAccountingContext: false, // Defaulting to false as it's not in formValues
        allowAddPriceFeed: false, // Defaulting to false as it's not in formValues
        ownerMustSendPayouts: false, // Defaulting to false as it's not in formValues
        holdFees: formValues.holdFees,
        useTotalSurplusForCashOuts: false, // Defaulting to false as it's not in formValues
        useDataHookForPay: useDataHookForPayValue,
        useDataHookForCashOut: false, // Defaulting to false as it's not in formValues
        dataHook, // doesn't change in edit ruleset
        metadata: 0, // Assuming no additional metadata is provided
        allowCrosschainSuckerExtension: false,
      },

      splitGroups: [
        {
          groupId: BigInt(NATIVE_TOKEN),
          splits: formValues.payoutSplits.map(split => ({
            preferAddToBalance: Boolean(split.preferAddToBalance),
            percent: Number(split.percent.value),
            projectId: BigInt(split.projectId),
            beneficiary: split.beneficiary as `0x${string}`,
            lockedUntil: split.lockedUntil ?? 0,
            hook: split.hook as `0x${string}`,
          })),
        },
        {
          groupId: BigInt(1),
          splits: formValues.reservedTokensSplits.map(split => ({
            preferAddToBalance: Boolean(split.preferAddToBalance),
            percent: Number(split.percent.value),
            projectId: BigInt(split.projectId),
            beneficiary: split.beneficiary as `0x${string}`,
            lockedUntil: split.lockedUntil ?? 0,
            hook: split.hook as `0x${string}`,
          })),
        },
      ],

      fundAccessLimitGroups: [
        {
          terminal: primaryNativeTerminal,
          token: tokenAddress,
          payoutLimits: [
            {
              amount: formValues.payoutLimit === undefined
                ? MAX_PAYOUT_LIMIT
                : parseWad(formValues.payoutLimit).toBigInt(),
              currency: 1, // Assuming currency is constant (e.g., USD)
            },
          ],
          surplusAllowances: [
            {
              amount: BigInt(0), // Assuming no surplus allowances for now
              currency: 1, // Assuming currency is constant (e.g., USD)
            },
          ],
        },
      ],
    },
  ]

  return [projectId, rulesetConfigurations, formValues.memo ?? ''] as const
}
