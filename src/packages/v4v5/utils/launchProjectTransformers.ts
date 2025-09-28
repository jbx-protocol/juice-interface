import {
  ETH_CURRENCY_ID,
  JBSplit,
  NATIVE_TOKEN,
  NATIVE_TOKEN_DECIMALS,
  SplitGroup,
  SplitPortion,
} from 'juice-sdk-core'

import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
} from 'packages/v2v3/models/fundingCycle'
import {
  GroupedSplits as V2V3GroupedSplits,
  Split as V2V3Split,
} from 'packages/v2v3/models/splits'

import round from 'lodash/round'
import { V2FundingCycleMetadata } from 'packages/v2/models/fundingCycle'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V3FundingCycleMetadata } from 'packages/v3/models/fundingCycle'
import { Address } from 'viem'
import { FundAccessLimitGroup } from '../models/fundAccessLimits'
import { GroupedSplits as V4GroupedSplits } from '../models/splits'
import { LaunchProjectJBTerminal } from '../models/terminals'
import { convertV2V3CurrencyOptionToV4 } from './currency'

const NATIVE_TOKEN_CURRENCY_ID = 61166 // v4TODO: put in SDK

export type LaunchV2V3ProjectArgs = [
  string, // _owner
  [string, number], // _projectMetadata [projectMetadataCID, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN]
  V2V3FundingCycleData, // _fundingCycleData
  V2FundingCycleMetadata | V3FundingCycleMetadata, // _fundingCycleMetadata
  string, // _mustStartAtOrAfter
  V2V3GroupedSplits<SplitGroup>[], // _groupedSplits
  V2V3FundAccessConstraint[], // _fundAccessConstraints
  string[], // _terminals
  string, // _memo
]

export function transformV2V3CreateArgsToV4({
  v2v3Args,
  primaryNativeTerminal,
  currencyTokenAddress,
}: {
  v2v3Args: LaunchV2V3ProjectArgs
  primaryNativeTerminal: Address
  currencyTokenAddress: Address
}) {
  const [
    _owner,
    _projectMetadata,
    _fundingCycleData,
    _fundingCycleMetadata,
    _mustStartAtOrAfter,
    _groupedSplits,
    _fundAccessConstraints,
    _terminals,
    _memo,
  ] = v2v3Args

  let mustStartAtOrAfterNum = parseInt(_mustStartAtOrAfter)
  // check if mustStartAtOrAfterNum is in ms or seconds, ensure in seconds
  if (mustStartAtOrAfterNum > 1000000000000) {
    mustStartAtOrAfterNum = round(
      (mustStartAtOrAfterNum = mustStartAtOrAfterNum / 1000),
    ) // convert ms to seconds
  }

  const now = round(new Date().getTime() / 1000)

  // V5 uses different approval hook addresses than v4
  // Map v4 approval hooks to their v5 equivalents
  const v4ToV5ApprovalHookMap: Record<string, Address> = {
    // v4 3-day hook -> v5 3-day hook
    '0xba8a653a5cc985d2f1458e80a9700490c11ab981': '0x09b23b09af88bb6d7e9c957ff9f861f1c917111b',
    // v4 1-day hook -> v5 1-day hook
    '0xd7ce0fe638e02a31fc7c8c231684d85ad9b2ca3d': '0xcffdd1303f24145bd2c84e7bf15af1eb6ab924d7',
    // v4 7-day hook -> v5 7-day hook
    '0x05505582a553669f540ba2dd0b55fc75b8176c40': '0xdf911b94712cf117fb63b69838b16e1710636031',
  }

  const ballotAddress = _fundingCycleData.ballot?.toLowerCase()
  const approvalHook =
    ballotAddress && v4ToV5ApprovalHookMap[ballotAddress]
      ? v4ToV5ApprovalHookMap[ballotAddress]
      : (_fundingCycleData.ballot as Address)

  const ruleset = {
    mustStartAtOrAfter:
      mustStartAtOrAfterNum > now ? mustStartAtOrAfterNum : now,
    duration: _fundingCycleData.duration.toNumber(),
    weight: _fundingCycleData.weight.toBigInt(),
    weightCutPercent: _fundingCycleData.discountRate.toNumber(),

    approvalHook,

    metadata: transformFCMetadataToRulesetMetadata({
      fundingCycleMetadata: _fundingCycleMetadata,
    }),

    splitGroups: transformV2V3SplitGroupToV4({
      v2v3SplitGroup: _groupedSplits,
    }),

    fundAccessLimitGroups: transformV2V3FundAccessConstraintsToV4({
      v2V3FundAccessConstraints: _fundAccessConstraints,
      primaryNativeTerminal,
      currencyTokenAddress,
    }),
  }

  const rulesetConfigurations = [ruleset]

  const terminalConfigurations = generateV4LaunchTerminalConfigurationsArg({
    terminals: _terminals,
    currencyTokenAddress,
  })

  const result = [
    _owner as Address,
    _projectMetadata[0], // Just the CID string
    rulesetConfigurations,
    terminalConfigurations,
    _memo,
  ] as const

  return result
}

export function transformFCMetadataToRulesetMetadata({
  fundingCycleMetadata,
}: {
  fundingCycleMetadata: V2FundingCycleMetadata | V3FundingCycleMetadata
}) {
  const metadata = {
    reservedPercent: fundingCycleMetadata.reservedRate.toNumber(),
    cashOutTaxRate: fundingCycleMetadata.redemptionRate.toNumber(),
    baseCurrency: ETH_CURRENCY_ID,
    pausePay: fundingCycleMetadata.pausePay,
    pauseRedeem: fundingCycleMetadata.pauseRedeem,
    pauseCreditTransfers: Boolean(fundingCycleMetadata.global.pauseTransfers),
    allowOwnerMinting: fundingCycleMetadata.allowMinting,
    allowSetCustomToken: false, // Assuming false by default
    allowTerminalMigration: fundingCycleMetadata.allowTerminalMigration,
    allowSetTerminals: fundingCycleMetadata.global.allowSetTerminals,
    allowSetController: fundingCycleMetadata.global.allowSetController,
    allowAddAccountingContext: false, // Not present in v2v3, passing false by default
    allowAddPriceFeed: false, // Not present in v2v3, passing false by default
    ownerMustSendPayouts: false, // Not present in v2v3, passing false by default
    holdFees: fundingCycleMetadata.holdFees,
    useTotalSurplusForCashOuts:
      fundingCycleMetadata.useTotalOverflowForRedemptions,
    useDataHookForPay: fundingCycleMetadata.useDataSourceForPay,
    useDataHookForCashOut: fundingCycleMetadata.useDataSourceForRedeem,
    dataHook: fundingCycleMetadata.dataSource as Address,
    metadata: 0,
    // Note: allowCrosschainSuckerExtension was removed - it doesn't exist in v4/v5 contracts
  }

  return metadata
}

type LaunchProjectJBSplit = Omit<JBSplit, 'percent'> & { percent: number }

export type LaunchV4ProjectGroupedSplit = Omit<
  V4GroupedSplits<SplitGroup>,
  'splits' | 'groupId'
> & { splits: LaunchProjectJBSplit[]; groupId: bigint }

export function transformV2V3SplitGroupToV4({
  v2v3SplitGroup,
}: {
  v2v3SplitGroup: V2V3GroupedSplits<SplitGroup>[]
}): LaunchV4ProjectGroupedSplit[] {
  return v2v3SplitGroup.map(group => ({
    groupId: group.group === SplitGroup.ETHPayout ? BigInt(NATIVE_TOKEN) : 1n, // TODO dont hardcode reserved token group as 1n
    splits: group.splits.map(split => ({
      preferAddToBalance: Boolean(split.preferClaimed),
      percent: split.percent,
      projectId: BigInt(parseInt(split.projectId ?? '0x00', 16)),
      beneficiary: split.beneficiary as Address,
      lockedUntil: split.lockedUntil ?? 0,
      hook: split.allocator as Address,
    })),
  }))
}

export function transformV2V3FundAccessConstraintsToV4({
  v2V3FundAccessConstraints,
  primaryNativeTerminal,
  currencyTokenAddress,
}: {
  v2V3FundAccessConstraints: V2V3FundAccessConstraint[]
  primaryNativeTerminal: Address
  currencyTokenAddress: Address
}): FundAccessLimitGroup[] {
  return v2V3FundAccessConstraints.map(constraint => ({
    terminal: primaryNativeTerminal as `0x${string}`,
    token: currencyTokenAddress as `0x${string}`,
    payoutLimits: [
      {
        amount: constraint.distributionLimit.toBigInt(),
        currency: convertV2V3CurrencyOptionToV4(
          constraint.distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
        ),
      },
    ],
    surplusAllowances: [
      {
        amount: constraint.overflowAllowance.toBigInt(),
        currency: ETH_CURRENCY_ID,
      },
    ],
  }))
}

function generateV4LaunchTerminalConfigurationsArg({
  terminals,
  currencyTokenAddress,
}: {
  terminals: string[]
  currencyTokenAddress: Address
}): LaunchProjectJBTerminal[] {
  return terminals.map(terminal => ({
    terminal: terminal as Address,
    accountingContextsToAccept: [
      {
        token: currencyTokenAddress as `0x${string}`, // NATIVE_TOKEN
        decimals: NATIVE_TOKEN_DECIMALS,
        currency: NATIVE_TOKEN_CURRENCY_ID, //61166
        // Jango - "anytime the NATIVE_TOKEN (0x00...eee) is being associated with a currency, use 61166"
      },
    ],
  }))
}

export function transformV2V3SplitsToV4({
  v2v3Splits,
}: {
  v2v3Splits: V2V3Split[]
}): JBSplit[] {
  return v2v3Splits.map(split => ({
    preferAddToBalance: Boolean(split.preferClaimed),
    percent: new SplitPortion(split.percent),
    projectId: BigInt(parseInt(split.projectId ?? '0x00', 16)),
    beneficiary: split.beneficiary as Address,
    lockedUntil: split.lockedUntil ?? 0,
    hook: split.allocator as Address,
  }))
}
