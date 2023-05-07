import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { V2BallotState } from 'models/ballot'
import { useContext } from 'react'

import { MAX_REDEMPTION_RATE } from 'utils/v2v3/math'
import { useRedemptionWeightOfNfts } from './useRedemptionWeightOfNfts'

import { useTotalNftRedemptionWeight } from './useTotalNftRedemptionWeight'

/**
 * Copies JB721Delegate.sol:redeemParams formula
 *
 * @param tokenIdsToRedeem
 * @returns amount in ETH
 */
export function useETHReceivedFromNftRedeem({
  tokenIdsToRedeem,
}: {
  tokenIdsToRedeem: string[] | undefined
}): BigNumber | undefined {
  const { fundingCycleMetadata, primaryTerminalCurrentOverflow, ballotState } =
    useContext(V2V3ProjectContext)

  // redemption weight of selected NFTs
  const { data: selectedRedemptionWeight } = useRedemptionWeightOfNfts({
    tokenIdsToRedeem,
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  // total redemption weight
  const { data: totalRedemptionWeight } = useTotalNftRedemptionWeight({
    dataSourceAddress: fundingCycleMetadata?.dataSource,
  })

  if (
    !fundingCycleMetadata ||
    !selectedRedemptionWeight?.gt(0) ||
    !totalRedemptionWeight?.gt(0)
  )
    return BigNumber.from(0)

  const redemptionRate =
    ballotState === V2BallotState.Active
      ? fundingCycleMetadata.ballotRedemptionRate
      : fundingCycleMetadata.redemptionRate

  const base = primaryTerminalCurrentOverflow
    ? primaryTerminalCurrentOverflow
        .mul(selectedRedemptionWeight)
        .div(totalRedemptionWeight)
    : BigNumber.from(0)

  if (redemptionRate.eq(BigNumber.from(MAX_REDEMPTION_RATE))) return base

  // return { base * [RR + (weight * (maxRR - RR) / total )] / maxRR }
  const numerator = redemptionRate.add(
    selectedRedemptionWeight
      .mul(BigNumber.from(MAX_REDEMPTION_RATE).sub(redemptionRate))
      .div(totalRedemptionWeight),
  )

  return base.mul(numerator).div(MAX_REDEMPTION_RATE)
}
