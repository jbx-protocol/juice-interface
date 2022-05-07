import { BigNumber } from '@ethersproject/bignumber'

import { V2FundingCycleMetadata } from 'models/v2/fundingCycle'

import { percentToPermyriad } from 'utils/formatNumber'

import { Wallet } from '@ethersproject/wallet'

import { invertPermyriad } from 'utils/bigNumbers'

import { decodeV2FundingCycleMetadata } from '../fundingCycle'

/**
 * Returns a mock FundingCyleMetadata packed into a BigNumber
 * @summary Should mirror the bit logic in JBFundingCycleMetadataResolver.sol.
 * https://github.com/jbx-protocol/juice-contracts-v2/blob/main/test/helpers/utils.js#L117
 * @param {custom obj} e.g. packFundingCycleMetadata({ reservedRate: 3500, pausePay: 1 })
 * @return {BigNumber}
 * @note Passing in an empty obj will use default values below
 */
export function packFundingCycleMetadata(
  packedMetadata: V2FundingCycleMetadata,
) {
  const one = BigNumber.from(1)

  const {
    version,
    global,
    reservedRate, // percentage
    redemptionRate, // percentage
    ballotRedemptionRate, // percentage
    pausePay, // boolean
    pauseDistributions, // boolean
    pauseRedeem, // boolean
    allowMinting, // boolean
    pauseBurn, // boolean
    allowChangeToken, // boolean
    allowTerminalMigration, // boolean
    allowControllerMigration, // boolean
    holdFees, // boolean
    useTotalOverflowForRedemptions, // boolean
    useDataSourceForPay, // boolean
    useDataSourceForRedeem, // boolean
    dataSource, // address
  } = packedMetadata

  let packed = BigNumber.from(version)
  if (global.allowSetTerminals) packed = packed.or(one.shl(8))
  if (global.allowSetController) packed = packed.or(one.shl(16))
  packed = packed.or(reservedRate.shl(24))
  packed = packed.or(invertPermyriad(redemptionRate).shl(40))
  packed = packed.or(invertPermyriad(ballotRedemptionRate).shl(56))
  if (pausePay) packed = packed.or(one.shl(74))
  if (pauseDistributions) packed = packed.or(one.shl(75))
  if (pauseRedeem) packed = packed.or(one.shl(76))
  if (pauseBurn) packed = packed.or(one.shl(77))
  if (allowMinting) packed = packed.or(one.shl(78))
  if (allowChangeToken) packed = packed.or(one.shl(79))
  if (allowTerminalMigration) packed = packed.or(one.shl(80))
  if (allowControllerMigration) packed = packed.or(one.shl(81))
  if (holdFees) packed = packed.or(one.shl(82))
  if (useTotalOverflowForRedemptions) packed = packed.or(one.shl(83))
  if (useDataSourceForPay) packed = packed.or(one.shl(84))
  if (useDataSourceForRedeem) packed = packed.or(one.shl(85))
  return packed.or(BigNumber.from(dataSource).shl(86))
}

const createMetadata = ({
  reservedRate,
  redemptionRate,
  ballotRedemptionRate,
  flagsEnabled = false,
}: {
  reservedRate: BigNumber
  redemptionRate: BigNumber
  ballotRedemptionRate: BigNumber
  flagsEnabled: boolean
}): V2FundingCycleMetadata => {
  const dataSource = Wallet.createRandom()
  return {
    version: 1,
    global: {
      allowSetTerminals: flagsEnabled,
      allowSetController: flagsEnabled,
    },
    reservedRate,
    redemptionRate,
    ballotRedemptionRate,

    pausePay: flagsEnabled,
    pauseDistributions: flagsEnabled,
    pauseRedeem: flagsEnabled,
    pauseBurn: flagsEnabled,
    allowMinting: flagsEnabled,
    allowChangeToken: flagsEnabled,
    allowTerminalMigration: flagsEnabled,
    allowControllerMigration: flagsEnabled,
    holdFees: flagsEnabled,
    useTotalOverflowForRedemptions: flagsEnabled,
    useDataSourceForPay: flagsEnabled,
    useDataSourceForRedeem: flagsEnabled,
    dataSource: dataSource.address, // hex, contract address
  }
}

describe('fundingCycle', () => {
  describe('decodeV2FundingCycleMetadata', () => {
    it.each`
      flagsEnabled
      ${true}
      ${false}
    `(
      'decodes metadata correctly when flagsEnabled is $flagsEnabled',
      ({ flagsEnabled }) => {
        const metadata = createMetadata({
          reservedRate: percentToPermyriad(69),
          redemptionRate: percentToPermyriad(71),
          ballotRedemptionRate: percentToPermyriad(92),
          flagsEnabled,
        })

        const packedMetadata = packFundingCycleMetadata(metadata)
        expect(decodeV2FundingCycleMetadata(packedMetadata)).toEqual(metadata)
      },
    )
  })
})
