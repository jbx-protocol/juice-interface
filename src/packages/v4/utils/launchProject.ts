import { V2FundingCycleMetadata } from 'packages/v2/models/fundingCycle'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
} from 'packages/v2v3/models/fundingCycle'
import { GroupedSplits, SplitGroup } from 'packages/v2v3/models/splits'
import { V3FundingCycleMetadata } from 'packages/v3/models/fundingCycle'

export type LaunchV2V3ProjectArgs = [
  string, // _owner
  [string, number], // _projectMetadata [projectMetadataCID, JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN]
  V2V3FundingCycleData, // _data
  V2FundingCycleMetadata | V3FundingCycleMetadata, // _metadata
  string, // _mustStartAtOrAfter
  GroupedSplits<SplitGroup>[], // _groupedSplits
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
  primaryNativeTerminal: `0x${string}`
  currencyTokenAddress: `0x${string}`
}) {
  const [
    _owner,
    _projectMetadata,
    _data,
    _metadata,
    _mustStartAtOrAfter,
    _groupedSplits,
    _fundAccessConstraints,
    _terminals,
    _memo,
  ] = v2v3Args

  const mustStartAtOrAfterNum = parseInt(_mustStartAtOrAfter)

  const rulesetConfigurations = [
    {
      mustStartAtOrAfter: mustStartAtOrAfterNum ?? 0, // 0 denotes start immediately
      duration: _data.duration.toNumber(),
      weight: _data.weight.toBigInt(),
      decayPercent: _data.discountRate.toNumber(),
      approvalHook: _data.ballot as `0x${string}`,

      metadata: {
        reservedPercent: _metadata.reservedRate.toNumber(),
        redemptionRate: _metadata.redemptionRate.toNumber(),
        baseCurrency: 1, // Not present in v2v3, passing 1 by default
        pausePay: _metadata.pausePay,
        pauseRedeem: _metadata.pauseRedeem,
        pauseCreditTransfers: Boolean(_metadata.global.pauseTransfers),
        allowOwnerMinting: _metadata.allowMinting,
        allowSetCustomToken: false, // Assuming false by default
        allowTerminalMigration: _metadata.allowTerminalMigration,
        allowSetTerminals: _metadata.global.allowSetTerminals,
        allowSetController: _metadata.global.allowSetController,
        allowAddAccountingContext: false, // Not present in v2v3, passing false by default
        allowAddPriceFeed: false, // Not present in v2v3, passing false by default
        ownerMustSendPayouts: false, // Not present in v2v3, passing false by default
        holdFees: _metadata.holdFees,
        useTotalSurplusForRedemptions: _metadata.useTotalOverflowForRedemptions,
        useDataHookForPay: _metadata.useDataSourceForPay,
        useDataHookForRedeem: _metadata.useDataSourceForRedeem,
        dataHook: _metadata.dataSource as `0x${string}`,
        metadata: 0,
        allowCrosschainSuckerExtension: false,
      },

      splitGroups: _groupedSplits.map(group => ({
        groupId: BigInt(group.group),
        splits: group.splits.map(split => ({
          preferAddToBalance: Boolean(split.preferClaimed),
          percent: split.percent,
          projectId: BigInt(parseInt(split.projectId ?? '0x00', 16)),
          beneficiary: split.beneficiary as `0x${string}`,
          lockedUntil: split.lockedUntil ?? 0,
          hook: split.allocator as `0x${string}`,
        })),
      })),

      fundAccessLimitGroups: _fundAccessConstraints.map(constraint => ({
        terminal: primaryNativeTerminal,
        token: currencyTokenAddress,
        payoutLimits: [
          {
            amount: constraint.distributionLimit.toBigInt(),
            currency: constraint.distributionLimitCurrency.toNumber(),
          },
        ] as const,
        surplusAllowances: [
          {
            amount: constraint.overflowAllowance.toBigInt(),
            currency: constraint.overflowAllowanceCurrency.toNumber(),
          },
        ] as const,
      })),
    },
  ]

  const terminalConfigurations = _terminals.map(terminal => ({
    terminal: terminal as `0x${string}`,
    accountingContextsToAccept: [
      // @v4todo:
      // {
      //   token: currencyTokenAddress,
      //   decimals: 18,
      //   currency: 0
      // }
    ] as const,
  }))

  return [
    _owner as `0x${string}`,
    _projectMetadata[0],
    rulesetConfigurations,
    terminalConfigurations,
    _memo,
  ] as const
}
