import { BigNumber } from '@ethersproject/bignumber'
import { BallotState } from 'models/ballot-state'
import { useContext } from 'react'
import { parseWad, permyriadToPercent } from 'utils/formatNumber'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import useProjectReservedTokens from './ProjectReservedTokens'

// Returns the value in ETH that an amount of tokens can be redeemed for
export function useETHReceivedFromTokens({
  tokenAmount,
}: {
  tokenAmount: string | undefined
}) {
  const {
    projectId,
    fundingCycle,
    fundingCycleMetadata,
    overflow,
    totalTokenSupply,
    ballotState,
  } = useContext(V2ProjectContext)

  const { data: undistributedReservedTokens } = useProjectReservedTokens({
    projectId,
    reservedRate: fundingCycleMetadata?.reservedRate,
  })

  if (!fundingCycle) return

  const realTotalTokenSupply = totalTokenSupply?.add(
    undistributedReservedTokens ?? BigNumber.from(0),
  )

  if (!fundingCycleMetadata || !realTotalTokenSupply?.gt(0))
    return BigNumber.from(0)

  const redemptionRate =
    ballotState === BallotState.Active
      ? permyriadToPercent(fundingCycleMetadata.ballotRedemptionRate)
      : permyriadToPercent(fundingCycleMetadata.redemptionRate)

  const redemptionRateBN = BigNumber.from(redemptionRate)

  const base =
    realTotalTokenSupply && overflow && tokenAmount
      ? overflow.mul(parseWad(tokenAmount ?? 0)).div(realTotalTokenSupply)
      : BigNumber.from(0)

  if (!redemptionRate || !base || !overflow) return BigNumber.from(0)

  const numerator = redemptionRateBN.add(
    parseWad(tokenAmount ?? 0)
      .mul(BigNumber.from(100).sub(redemptionRateBN))
      .div(realTotalTokenSupply),
  )
  const denominator = 100

  // Formula: https://www.desmos.com/calculator/sp9ru6zbpk
  return base.mul(numerator).div(denominator)
}
