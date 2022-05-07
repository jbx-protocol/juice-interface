import { BigNumber } from '@ethersproject/bignumber'
import {
  V2FundingCycleData,
  V2FundingCycleMetadata,
  V2FundAccessConstraint,
} from 'models/v2/fundingCycle'
import { fromWad, parseWad } from 'utils/formatNumber'

export type SerializedV2FundingCycleMetadata = Record<
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
> &
  Record<
    keyof Pick<
      V2FundingCycleMetadata,
      'reservedRate' | 'redemptionRate' | 'ballotRedemptionRate' | 'dataSource'
    >,
    string
  > &
  Pick<V2FundingCycleMetadata, 'global'>

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

export const serializeV2FundingCycleData = (
  fundingCycleData: V2FundingCycleData,
): SerializedV2FundingCycleData => ({
  duration: fundingCycleData.duration.toString(),
  weight: fromWad(fundingCycleData.weight),
  discountRate: fundingCycleData.discountRate.toString(),
  ballot: fundingCycleData.ballot, // hex, contract address
})

export const deserializeV2FundingCycleData = (
  serializedFundingCycleData: SerializedV2FundingCycleData,
): V2FundingCycleData => ({
  duration: BigNumber.from(serializedFundingCycleData.duration || '0'),
  weight: parseWad(serializedFundingCycleData.weight),
  discountRate: BigNumber.from(serializedFundingCycleData.discountRate),
  ballot: serializedFundingCycleData.ballot, // hex, contract address
})

export const serializeFundAccessConstraint = (
  fundAccessConstraint: V2FundAccessConstraint,
): SerializedV2FundAccessConstraint => {
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
  fundAccessConstraint: SerializedV2FundAccessConstraint,
): V2FundAccessConstraint => {
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
