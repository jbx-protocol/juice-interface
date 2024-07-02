import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2BallotState } from 'models/ballot'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { MAX_REDEMPTION_RATE } from 'packages/v2v3/utils/math'
import { useContext } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { useProjectReservedTokens } from './ProjectReservedTokens'

/**
 * Returns the value in ETH that an amount of tokens can be redeemed for
 * Formula: https://www.desmos.com/calculator/sp9ru6zbpk
 *
 * y = ox/s * ( r + (x(1 - r)/s) )
 *
 * Where:
 * y = redeemable amount
 *
 * o = overflow (primaryTerminalCurrentOverflow)
 * x = tokenAmount
 * s = total supply of token (realTotalTokenSupply)
 * r = redemptionRate
 *
 * @param param0
 * @returns amount in ETH
 */
export function useETHReceivedFromTokens({
  tokenAmount,
}: {
  tokenAmount: string | undefined
}): bigint | undefined {
  const {
    fundingCycle,
    fundingCycleMetadata,
    primaryTerminalCurrentOverflow,
    totalTokenSupply,
    ballotState,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: undistributedReservedTokens } = useProjectReservedTokens({
    projectId,
    reservedRate: fundingCycleMetadata?.reservedRate,
  })

  if (!fundingCycle) return

  const realTotalTokenSupply = undistributedReservedTokens
    ? totalTokenSupply
      ? totalTokenSupply + undistributedReservedTokens
      : undefined
    : totalTokenSupply

  if (
    !fundingCycleMetadata ||
    !(realTotalTokenSupply && realTotalTokenSupply > 0n) ||
    !tokenAmount
  )
    return BigInt(0)

  const redemptionRate =
    ballotState === V2BallotState.Active
      ? fundingCycleMetadata.ballotRedemptionRate
      : fundingCycleMetadata.redemptionRate

  const tokenAmountWad = parseWad(tokenAmount)

  // base = ox/s
  const base =
    realTotalTokenSupply && primaryTerminalCurrentOverflow
      ? (primaryTerminalCurrentOverflow * tokenAmountWad) / realTotalTokenSupply
      : BigInt(0)

  // numerator = r + (x(1 - r)/s)
  const numerator =
    redemptionRate +
    (tokenAmountWad * (MAX_REDEMPTION_RATE - redemptionRate)) /
      realTotalTokenSupply

  // y = base * numerator ==> ox/s * ( r + (x(1 - r)/s) )
  return (base * numerator) / MAX_REDEMPTION_RATE
}
