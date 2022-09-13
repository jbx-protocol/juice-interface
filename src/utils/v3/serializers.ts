import { BigNumber } from '@ethersproject/bignumber'
import {
  V3FundAccessConstraint,
  V3FundingCycleData,
  V3FundingCycleMetadata,
} from 'models/v3/fundingCycle'
import { fromWad, parseWad } from 'utils/formatNumber'

export type SerializedV3FundingCycleMetadata = Record<
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
> &
  Record<
    keyof Pick<
      V3FundingCycleMetadata,
      'reservedRate' | 'redemptionRate' | 'ballotRedemptionRate' | 'dataSource'
    >,
    string
  > &
  Pick<V3FundingCycleMetadata, 'global'>

export type SerializedV3FundingCycleData = Record<
  keyof V3FundingCycleData,
  string
>

export type SerializedV3FundAccessConstraint = Record<
  keyof V3FundAccessConstraint,
  string
>

export const serializeV3FundingCycleMetadata = (
  fundingCycleMetadata: V3FundingCycleMetadata,
): SerializedV3FundingCycleMetadata => ({
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

export const deserializeV3FundingCycleMetadata = (
  serializedFundingCycleMetadata: SerializedV3FundingCycleMetadata,
): Omit<V3FundingCycleMetadata, 'version'> => ({
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

export const serializeV3FundingCycleData = (
  fundingCycleData: V3FundingCycleData,
): SerializedV3FundingCycleData => ({
  duration: fundingCycleData.duration.toString(),
  weight: fundingCycleData.weight.toString(),
  discountRate: fundingCycleData.discountRate.toString(),
  ballot: fundingCycleData.ballot, // hex, contract address
})

export const deserializeV3FundingCycleData = (
  serializedFundingCycleData: SerializedV3FundingCycleData,
): V3FundingCycleData => ({
  duration: BigNumber.from(serializedFundingCycleData.duration || '0'),
  weight: BigNumber.from(serializedFundingCycleData.weight),
  discountRate: BigNumber.from(serializedFundingCycleData.discountRate),
  ballot: serializedFundingCycleData.ballot, // hex, contract address
})

export const serializeFundAccessConstraint = (
  fundAccessConstraint: V3FundAccessConstraint,
): SerializedV3FundAccessConstraint => {
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
  fundAccessConstraint: SerializedV3FundAccessConstraint,
): V3FundAccessConstraint => {
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
