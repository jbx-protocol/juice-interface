import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V1BallotState } from 'models/ballot'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1ContractName } from 'packages/v1/models/contracts'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import { decodeFundingCycleMetadata } from 'packages/v1/utils/fundingCycle'
import { useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'
import { parseWad } from 'utils/format/formatNumber'

import useContractReader from './useContractReader'

// Returns the value in ETH that an amount of tokens can be redeemed for
export function useRedeemRate({
  tokenAmount,
  fundingCycle,
}: {
  tokenAmount: string | undefined
  fundingCycle: V1FundingCycle | undefined
}) {
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const metadata = decodeFundingCycleMetadata(fundingCycle?.metadata)

  const currentOverflow = useContractReader<BigNumber>({
    contract: terminal?.name,
    functionName: 'currentOverflowOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })

  const reservedTicketBalance = useContractReader<BigNumber>({
    contract: terminal?.name,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && metadata?.reservedRate
        ? [projectId, metadata.reservedRate]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  const totalSupply = useContractReader<BigNumber>({
    contract: V1ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })?.add(reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0))

  const currentBallotState = useContractReader<V1BallotState>({
    contract: V1ContractName.FundingCycles,
    functionName: 'currentBallotStateOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })

  return useMemo(() => {
    if (!metadata || !totalSupply?.gt(0)) return BigNumber.from(0)

    const bondingCurveRate =
      currentBallotState === V1BallotState.Active
        ? metadata.reconfigurationBondingCurveRate
        : metadata.bondingCurveRate

    const base =
      totalSupply && currentOverflow && tokenAmount
        ? currentOverflow.mul(parseWad(tokenAmount)).div(totalSupply)
        : BigNumber.from(0)

    if (!bondingCurveRate || !base || !currentOverflow) return BigNumber.from(0)

    const numerator = BigNumber.from(bondingCurveRate).add(
      parseWad(tokenAmount ?? 0)
        .mul(200 - bondingCurveRate)
        .div(totalSupply),
    )
    const denominator = 200

    // Formula: https://www.desmos.com/calculator/sp9ru6zbpk
    return base.mul(numerator).div(denominator)
  }, [totalSupply, currentOverflow, currentBallotState, metadata, tokenAmount])
}
