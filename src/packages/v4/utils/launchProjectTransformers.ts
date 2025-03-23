import {
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
import { GroupedSplits as V2V3GroupedSplits, Split as V2V3Split } from 'packages/v2v3/models/splits'

import round from 'lodash/round'
import { V2FundingCycleMetadata } from 'packages/v2/models/fundingCycle'
import { V3FundingCycleMetadata } from 'packages/v3/models/fundingCycle'
import { Address } from 'viem'
import { FundAccessLimitGroup } from '../models/fundAccessLimits'
import { GroupedSplits as V4GroupedSplits } from '../models/splits'
import { LaunchProjectJBTerminal } from '../models/terminals'
import { BASE_CURRENCY_ETH } from './shared/currency'

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

  const mustStartAtOrAfterNum = parseInt(_mustStartAtOrAfter)
  const now = round(new Date().getTime() / 1000)

  const ruleset = {
    mustStartAtOrAfter:
      mustStartAtOrAfterNum > now ? mustStartAtOrAfterNum : now,
    duration: _fundingCycleData.duration.toNumber(),
    weight: _fundingCycleData.weight.toBigInt(),
    weightCutPercent: _fundingCycleData.discountRate.toNumber(),

    approvalHook: _fundingCycleData.ballot as Address,

    metadata: transformFCMetadataToRulesetMetadata({
      fundingCycleMetadata: _fundingCycleMetadata,
    }),

    splitGroups: transformV2V3SplitGroupToV4({ v2v3SplitGroup: _groupedSplits }),

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

  return [
    _owner as Address,
    _projectMetadata[0],
    rulesetConfigurations,
    terminalConfigurations,
    _memo,
  ] as const
}

export function transformFCMetadataToRulesetMetadata({
  fundingCycleMetadata,
}: {
  fundingCycleMetadata: V2FundingCycleMetadata | V3FundingCycleMetadata
}) {
  return {
    reservedPercent: fundingCycleMetadata.reservedRate.toNumber(),
    cashOutTaxRate: fundingCycleMetadata.redemptionRate.toNumber(),
    baseCurrency: BASE_CURRENCY_ETH,
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
    allowCrosschainSuckerExtension: false,
  }
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
    terminal: primaryNativeTerminal,
    token: currencyTokenAddress,
    payoutLimits: [
      {
        amount: constraint.distributionLimit.toBigInt(),
        currency: Number(BigInt(NATIVE_TOKEN)), // TODO support USD somehow
      },
    ],
    surplusAllowances: [
      {
        amount: constraint.overflowAllowance.toBigInt(),
        currency: Number(BigInt(NATIVE_TOKEN)),
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
        token: currencyTokenAddress,
        decimals: NATIVE_TOKEN_DECIMALS,
        currency: Number(BigInt(currencyTokenAddress)),
      },
    ],
  }))
}

export function transformV2V3SplitsToV4({
  v2v3Splits
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
