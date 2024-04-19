import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1BallotState } from 'models/ballot'
import { V1ContractName } from 'models/v1/contracts'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { useContext, useMemo } from 'react'
import { bigintsDiff, toHexString } from 'utils/bigNumbers'
import { parseWad } from 'utils/format/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

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

  const currentOverflow = useContractReader<bigint>({
    contract: terminal?.name,
    functionName: 'currentOverflowOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
    valueDidChange: bigintsDiff,
  })

  const reservedTicketBalance = useContractReader<bigint>({
    contract: terminal?.name,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && metadata?.reservedRate
        ? [projectId, metadata.reservedRate]
        : null,
    valueDidChange: bigintsDiff,
  })

  const totalSupply =
    (useContractReader<bigint>({
      contract: V1ContractName.TicketBooth,
      functionName: 'totalSupplyOf',
      args: projectId ? [toHexString(BigInt(projectId))] : null,
      valueDidChange: bigintsDiff,
    }) ?? 0n) + (reservedTicketBalance ? reservedTicketBalance : BigInt(0))

  const currentBallotState = useContractReader<V1BallotState>({
    contract: V1ContractName.FundingCycles,
    functionName: 'currentBallotStateOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
  })

  return useMemo(() => {
    if (!metadata || !(totalSupply > 0n)) return BigInt(0)

    const bondingCurveRate =
      currentBallotState === V1BallotState.Active
        ? metadata.reconfigurationBondingCurveRate
        : metadata.bondingCurveRate

    const base =
      totalSupply && currentOverflow && tokenAmount
        ? (currentOverflow * parseWad(tokenAmount)) / totalSupply
        : BigInt(0)

    if (!bondingCurveRate || !base || !currentOverflow) return BigInt(0)

    const numerator =
      BigInt(bondingCurveRate) +
      (parseWad(tokenAmount ?? 0) * (200n - BigInt(bondingCurveRate))) /
        totalSupply

    const denominator = 200n
    // Formula: https://www.desmos.com/calculator/sp9ru6zbpk
    return (base * numerator) / denominator
  }, [totalSupply, currentOverflow, currentBallotState, metadata, tokenAmount])
}
