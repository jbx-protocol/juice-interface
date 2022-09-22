import { BigNumber } from '@ethersproject/bignumber'
import {
  V2FundingCycleMetadata,
  V2V3FundAccessConstraint,
  V2V3FundingCycleData,
} from 'models/v2/fundingCycle'
import { fromWad, parseWad } from 'utils/format/formatNumber'

type V2FundingCycleMetadataStrings = Record<
  keyof Pick<
    V2FundingCycleMetadata,
    'reservedRate' | 'redemptionRate' | 'ballotRedemptionRate' | 'dataSource'
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

export type SerializedV2FundingCycleMetadata = V2FundingCycleMetadataBooleans &
  V2FundingCycleMetadataStrings &
  Pick<V2FundingCycleMetadata, 'global'>

export type SerializedV2V3FundingCycleData = Record<
  keyof V2V3FundingCycleData,
  string
>

export type SerializedV2V3FundAccessConstraint = Record<
  keyof V2V3FundAccessConstraint,
  string
>

export const serializeV2FundingCycleMetadata = (
  fundingCycleMetadata: V2FundingCycleMetadata,
): SerializedV2FundingCycleMetadata => ({
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
  allowChangeToken: fundingCycleMetadata.allowChangeToken,
  allowTerminalMigration: fundingCycleMetadata.allowTerminalMigration,
  allowControllerMigration: fundingCycleMetadata.allowControllerMigration,
  holdFees: fundingCycleMetadata.holdFees,
  useTotalOverflowForRedemptions:
    fundingCycleMetadata.useTotalOverflowForRedemptions,
  useDataSourceForPay: fundingCycleMetadata.useDataSourceForPay,
  useDataSourceForRedeem: fundingCycleMetadata.useDataSourceForRedeem,
  dataSource: fundingCycleMetadata.dataSource, // hex, contract address
})

export const deserializeV2FundingCycleMetadata = (
  serializedFundingCycleMetadata: SerializedV2FundingCycleMetadata,
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
