import { BigNumber } from '@ethersproject/bignumber'
import {
  V2FundingCycleData,
  V2FundingCycleMetadata,
  V2FundAccessConstraint,
} from 'models/v2/fundingCycle'
import {
  fromPerbicent,
  fromPermille,
  fromWad,
  parsePerbicent,
  parsePermille,
  parseWad,
} from 'utils/formatNumber'

export type SerializedV2FundingCycleMetadata = Record<
  keyof Omit<
    V2FundingCycleMetadata,
    'reservedRate' | 'redemptionRate' | 'ballotRedemptionRate' | 'dataSource'
  >,
  boolean
> &
  Record<
    keyof Pick<
      V2FundingCycleMetadata,
      'reservedRate' | 'redemptionRate' | 'ballotRedemptionRate' | 'dataSource'
    >,
    string
  >

export type SerializedV2FundingCycleData = Record<
  keyof V2FundingCycleData,
  string
>

export type SerializedV2FundAccessConstraint = Record<
  keyof V2FundAccessConstraint,
  string
>

export const serializeV2FundingCycleMetadata = (
  fundingCycleMetadata: V2FundingCycleMetadata,
): SerializedV2FundingCycleMetadata => ({
  reservedRate: fromPermille(fundingCycleMetadata.reservedRate),
  redemptionRate: fromPerbicent(fundingCycleMetadata.redemptionRate),
  ballotRedemptionRate: fromPerbicent(
    fundingCycleMetadata.ballotRedemptionRate,
  ),
  pausePay: fundingCycleMetadata.pausePay,
  pauseDistributions: fundingCycleMetadata.pauseDistributions,
  pauseRedeem: fundingCycleMetadata.pauseRedeem,
  pauseMint: fundingCycleMetadata.pauseMint,
  pauseBurn: fundingCycleMetadata.pauseBurn,
  allowTerminalMigration: fundingCycleMetadata.allowTerminalMigration,
  allowControllerMigration: fundingCycleMetadata.allowControllerMigration,
  holdFees: fundingCycleMetadata.holdFees,
  useLocalBalanceForRedemptions:
    fundingCycleMetadata.useLocalBalanceForRedemptions,
  useDataSourceForPay: fundingCycleMetadata.useDataSourceForPay,
  useDataSourceForRedeem: fundingCycleMetadata.useDataSourceForRedeem,
  dataSource: fundingCycleMetadata.dataSource, // hex, contract address
})

export const deserializeV2FundingCycleMetadata = (
  serializedFundingCycleMetadata: SerializedV2FundingCycleMetadata,
): V2FundingCycleMetadata => ({
  reservedRate: parsePermille(serializedFundingCycleMetadata.reservedRate),
  redemptionRate: parsePerbicent(serializedFundingCycleMetadata.redemptionRate),
  ballotRedemptionRate: parsePerbicent(
    serializedFundingCycleMetadata.ballotRedemptionRate,
  ),
  pausePay: serializedFundingCycleMetadata.pausePay,
  pauseDistributions: serializedFundingCycleMetadata.pauseDistributions,
  pauseRedeem: serializedFundingCycleMetadata.pauseRedeem,
  pauseMint: serializedFundingCycleMetadata.pauseMint,
  pauseBurn: serializedFundingCycleMetadata.pauseBurn,
  allowTerminalMigration: serializedFundingCycleMetadata.allowTerminalMigration,
  allowControllerMigration:
    serializedFundingCycleMetadata.allowControllerMigration,
  holdFees: serializedFundingCycleMetadata.holdFees,
  useLocalBalanceForRedemptions:
    serializedFundingCycleMetadata.useLocalBalanceForRedemptions,
  useDataSourceForPay: serializedFundingCycleMetadata.useDataSourceForPay,
  useDataSourceForRedeem: serializedFundingCycleMetadata.useDataSourceForRedeem,
  dataSource: serializedFundingCycleMetadata.dataSource, // hex, contract address
})

export const serializeV2FundingCycleData = (
  fundingCycleData: V2FundingCycleData,
): SerializedV2FundingCycleData => ({
  duration: fundingCycleData.duration.toString(),
  weight: fromWad(fundingCycleData.weight),
  discountRate: fromPermille(fundingCycleData.discountRate),
  ballot: fundingCycleData.ballot, // hex, contract address
})

export const deserializeV2FundingCycleData = (
  serializedFundingCycleData: SerializedV2FundingCycleData,
): V2FundingCycleData => ({
  duration: BigNumber.from(serializedFundingCycleData.duration || '0'),
  weight: parseWad(serializedFundingCycleData.weight),
  discountRate: parsePermille(serializedFundingCycleData.discountRate),
  ballot: serializedFundingCycleData.ballot, // hex, contract address
})

export const serializeFundAccessConstraint = (
  fundAccessConstraint: V2FundAccessConstraint,
): SerializedV2FundAccessConstraint => {
  return {
    terminal: fundAccessConstraint.terminal,
    distributionLimit: fromWad(fundAccessConstraint.distributionLimit),
    distributionLimitCurrency:
      fundAccessConstraint.distributionLimitCurrency.toString(),
    overflowAllowance: fromWad(fundAccessConstraint.overflowAllowance),
    overflowAllowanceCurrency:
      fundAccessConstraint.overflowAllowanceCurrency.toString(),
  }
}

export const deserializeFundAccessConstraint = (
  fundAccessConstraint: SerializedV2FundAccessConstraint,
): V2FundAccessConstraint => {
  return {
    terminal: fundAccessConstraint.terminal,
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
