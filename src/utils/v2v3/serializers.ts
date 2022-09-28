import { BigNumber } from '@ethersproject/bignumber'
import { V2FundingCycleMetadata } from 'models/v2/fundingCycle'
import {
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { V3FundingCycleMetadata } from 'models/v3/fundingCycle'
import { fromWad, parseWad } from 'utils/format/formatNumber'

type V2FundingCycleMetadataStrings = Record<
  keyof Pick<
    V2FundingCycleMetadata,
    'reservedRate' | 'redemptionRate' | 'ballotRedemptionRate' | 'dataSource'
  >,
  string
>

type V3FundingCycleMetadataStrings = Record<
  keyof Pick<
    V3FundingCycleMetadata,
    | 'reservedRate'
    | 'redemptionRate'
    | 'ballotRedemptionRate'
    | 'dataSource'
    | 'metadata'
  >,
  string
>

type V2FundingCycleMetadataBooleans = Record<
  keyof Omit<
    V2FundingCycleMetadata,
    | 'reservedRate'
    | 'redemptionRate'
    | 'ballotRedemptionRate'
    | 'dataSource'
    | 'version'
    | 'global'
  >,
  boolean
>

type V3FundingCycleMetadataBooleans = Record<
  keyof Omit<
    V3FundingCycleMetadata,
    | 'reservedRate'
    | 'redemptionRate'
    | 'ballotRedemptionRate'
    | 'dataSource'
    | 'version'
    | 'global'
  >,
  boolean
>

type SerializedV2FundingCycleMetadata = V2FundingCycleMetadataBooleans &
  V2FundingCycleMetadataStrings &
  Pick<V2FundingCycleMetadata, 'global'>

type SerializedV3FundingCycleMetadata = V3FundingCycleMetadataBooleans &
  V3FundingCycleMetadataStrings &
  Pick<V3FundingCycleMetadata, 'global'>

export type SerializedV2V3FundingCycleMetadata =
  | SerializedV3FundingCycleMetadata
  | SerializedV2FundingCycleMetadata

export type SerializedV2V3FundingCycleData = Record<
  keyof V2V3FundingCycleData,
  string
>

export type SerializedV2V3FundAccessConstraint = Record<
  keyof V2V3FundAccessConstraint,
  string
>

export const serializeV2V3FundingCycleMetadata = (
  fundingCycleMetadata: V2V3FundingCycleMetadata,
): SerializedV2V3FundingCycleMetadata => {
  const baseSerializedMetadata = {
    global: {
      allowSetTerminals: fundingCycleMetadata.global.allowSetTerminals,
      allowSetController: fundingCycleMetadata.global.allowSetController,
    },
    reservedRate: fundingCycleMetadata.reservedRate.toString(),
    redemptionRate: fundingCycleMetadata.redemptionRate.toString(),
    ballotRedemptionRate: fundingCycleMetadata.ballotRedemptionRate.toString(),
    pausePay: fundingCycleMetadata.pausePay,
    pauseDistributions: fundingCycleMetadata.pauseDistributions,
    pauseRedeem: fundingCycleMetadata.pauseRedeem,
    allowMinting: fundingCycleMetadata.allowMinting,
    pauseBurn: fundingCycleMetadata.pauseBurn,

    allowTerminalMigration: fundingCycleMetadata.allowTerminalMigration,
    allowControllerMigration: fundingCycleMetadata.allowControllerMigration,
    holdFees: fundingCycleMetadata.holdFees,
    useTotalOverflowForRedemptions:
      fundingCycleMetadata.useTotalOverflowForRedemptions,
    useDataSourceForPay: fundingCycleMetadata.useDataSourceForPay,
    useDataSourceForRedeem: fundingCycleMetadata.useDataSourceForRedeem,
    dataSource: fundingCycleMetadata.dataSource, // hex, contract address
  }

  // Return V2 FC Metadata type if fundingCycleMetadata matches the type
  if (
    typeof (fundingCycleMetadata as V2FundingCycleMetadata).allowChangeToken !==
    'undefined'
  ) {
    return {
      ...baseSerializedMetadata,
      allowChangeToken: (fundingCycleMetadata as V2FundingCycleMetadata)
        .allowChangeToken,
    } as SerializedV2FundingCycleMetadata
  }

  return {
    ...baseSerializedMetadata,
    global: {
      ...baseSerializedMetadata.global,
      pauseTransfers: (fundingCycleMetadata as V3FundingCycleMetadata).global
        .pauseTransfers,
    },
    preferClaimedTokenOverride: (fundingCycleMetadata as V3FundingCycleMetadata)
      .preferClaimedTokenOverride,
    metadata: (fundingCycleMetadata as V3FundingCycleMetadata).metadata,
  } as SerializedV3FundingCycleMetadata
}

export const deserializeV2V3FundingCycleMetadata = (
  serializedFundingCycleMetadata: SerializedV2V3FundingCycleMetadata,
): Omit<V2FundingCycleMetadata, 'version'> => ({
  global: {
    allowSetTerminals: serializedFundingCycleMetadata.global.allowSetTerminals,
    allowSetController:
      serializedFundingCycleMetadata.global.allowSetController,
  },
  reservedRate: BigNumber.from(serializedFundingCycleMetadata.reservedRate),
  redemptionRate: BigNumber.from(serializedFundingCycleMetadata.redemptionRate),
  ballotRedemptionRate: BigNumber.from(
    serializedFundingCycleMetadata.ballotRedemptionRate,
  ),
  pausePay: serializedFundingCycleMetadata.pausePay,
  pauseDistributions: serializedFundingCycleMetadata.pauseDistributions,
  pauseRedeem: serializedFundingCycleMetadata.pauseRedeem,
  allowMinting: serializedFundingCycleMetadata.allowMinting,
  pauseBurn: serializedFundingCycleMetadata.pauseBurn,
  allowChangeToken: serializedFundingCycleMetadata.allowChangeToken,
  allowTerminalMigration: serializedFundingCycleMetadata.allowTerminalMigration,
  allowControllerMigration:
    serializedFundingCycleMetadata.allowControllerMigration,
  holdFees: serializedFundingCycleMetadata.holdFees,
  useTotalOverflowForRedemptions:
    serializedFundingCycleMetadata.useTotalOverflowForRedemptions,
  useDataSourceForPay: serializedFundingCycleMetadata.useDataSourceForPay,
  useDataSourceForRedeem: serializedFundingCycleMetadata.useDataSourceForRedeem,
  dataSource: serializedFundingCycleMetadata.dataSource, // hex, contract address
})

export const serializeV2V3FundingCycleData = (
  fundingCycleData: V2V3FundingCycleData,
): SerializedV2V3FundingCycleData => ({
  duration: fundingCycleData.duration.toString(),
  weight: fundingCycleData.weight.toString(),
  discountRate: fundingCycleData.discountRate.toString(),
  ballot: fundingCycleData.ballot, // hex, contract address
})

export const deserializeV2V3FundingCycleData = (
  serializedFundingCycleData: SerializedV2V3FundingCycleData,
): V2V3FundingCycleData => ({
  duration: BigNumber.from(serializedFundingCycleData.duration || '0'),
  weight: BigNumber.from(serializedFundingCycleData.weight),
  discountRate: BigNumber.from(serializedFundingCycleData.discountRate),
  ballot: serializedFundingCycleData.ballot, // hex, contract address
})

export const serializeFundAccessConstraint = (
  fundAccessConstraint: V2V3FundAccessConstraint,
): SerializedV2V3FundAccessConstraint => {
  return {
    terminal: fundAccessConstraint.terminal,
    token: fundAccessConstraint.token,
    distributionLimit: fromWad(fundAccessConstraint.distributionLimit),
    distributionLimitCurrency:
      fundAccessConstraint.distributionLimitCurrency.toString(),
    overflowAllowance: fromWad(fundAccessConstraint.overflowAllowance),
    overflowAllowanceCurrency:
      fundAccessConstraint.overflowAllowanceCurrency.toString(),
  }
}

export const deserializeFundAccessConstraint = (
  fundAccessConstraint: SerializedV2V3FundAccessConstraint,
): V2V3FundAccessConstraint => {
  return {
    terminal: fundAccessConstraint.terminal,
    token: fundAccessConstraint.token,
    distributionLimit: parseWad(fundAccessConstraint.distributionLimit),
    distributionLimitCurrency: BigNumber.from(
      fundAccessConstraint.distributionLimitCurrency,
    ),
    overflowAllowance: parseWad(fundAccessConstraint.overflowAllowance),
    overflowAllowanceCurrency: BigNumber.from(
      fundAccessConstraint.overflowAllowanceCurrency.toString(),
    ),
  }
}
