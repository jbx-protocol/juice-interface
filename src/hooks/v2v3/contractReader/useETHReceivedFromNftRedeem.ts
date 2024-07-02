import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
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
}): bigint | undefined {
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
    !(selectedRedemptionWeight && selectedRedemptionWeight > 0n) ||
    !(totalRedemptionWeight && totalRedemptionWeight > 0n)
  )
    return BigInt(0)

  const redemptionRate =
    ballotState === V2BallotState.Active
      ? fundingCycleMetadata.ballotRedemptionRate
      : fundingCycleMetadata.redemptionRate

  const base = primaryTerminalCurrentOverflow
    ? (primaryTerminalCurrentOverflow * selectedRedemptionWeight) /
      totalRedemptionWeight
    : BigInt(0)

  if (redemptionRate === BigInt(MAX_REDEMPTION_RATE)) return base

  const numerator =
    redemptionRate +
    (selectedRedemptionWeight * (MAX_REDEMPTION_RATE - redemptionRate)) /
      totalRedemptionWeight
  return (base * numerator) / MAX_REDEMPTION_RATE
}
