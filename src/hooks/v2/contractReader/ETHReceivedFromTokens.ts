import { BigNumber } from '@ethersproject/bignumber'
import { V2BallotState } from 'models/ballot'
import { useContext } from 'react'
import { parseWad } from 'utils/formatNumber'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { MAX_REDEMPTION_RATE } from 'utils/v2/math'

import useProjectReservedTokens from './ProjectReservedTokens'

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
}): BigNumber | undefined {
  const {
    projectId,
    fundingCycle,
    fundingCycleMetadata,
    primaryTerminalCurrentOverflow,
    totalTokenSupply,
    ballotState,
  } = useContext(V2ProjectContext)

  const { data: undistributedReservedTokens } = useProjectReservedTokens({
    projectId,
    reservedRate: fundingCycleMetadata?.reservedRate,
  })

  if (!fundingCycle) return

  const realTotalTokenSupply = undistributedReservedTokens
    ? totalTokenSupply?.add(undistributedReservedTokens)
    : totalTokenSupply

  if (!fundingCycleMetadata || !realTotalTokenSupply?.gt(0) || !tokenAmount)
    return BigNumber.from(0)

  const redemptionRate =
    ballotState === V2BallotState.Active
      ? fundingCycleMetadata.ballotRedemptionRate
      : fundingCycleMetadata.redemptionRate

  const tokenAmountWad = parseWad(tokenAmount)

  // base = ox/s
  const base =
    realTotalTokenSupply && primaryTerminalCurrentOverflow
      ? primaryTerminalCurrentOverflow
          .mul(tokenAmountWad)
          .div(realTotalTokenSupply)
      : BigNumber.from(0)

  // numerator = r + (x(1 - r)/s)
  const numerator = redemptionRate.add(
    tokenAmountWad
      .mul(BigNumber.from(MAX_REDEMPTION_RATE).sub(redemptionRate))
      .div(realTotalTokenSupply),
  )

  // y = base * numerator ==> ox/s * ( r + (x(1 - r)/s) )
  return base.mul(numerator).div(MAX_REDEMPTION_RATE)
}
