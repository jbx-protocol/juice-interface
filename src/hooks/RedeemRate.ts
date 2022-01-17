import { ProjectContext } from 'contexts/projectContext'
import { BigNumber } from 'ethers'
import { BallotState } from 'models/ballot-state'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { parseWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import useContractReader from './ContractReader'

// Returns the value in ETH that an amount of tokens can be redeemed for
export function useRedeemRate({
  tokenAmount,
  fundingCycle,
}: {
  tokenAmount: string | undefined
  fundingCycle: FundingCycle | undefined
}) {
  const { projectId, terminal } = useContext(ProjectContext)

  const metadata = decodeFundingCycleMetadata(fundingCycle?.metadata)

  const currentOverflow = useContractReader<BigNumber>({
    contract: terminal?.name,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
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
    contract: ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [projectId?.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })?.add(reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0))

  const currentBallotState = useContractReader<BallotState>({
    contract: ContractName.FundingCycles,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  return useMemo(() => {
    if (!metadata || !totalSupply?.gt(0)) return

    const bondingCurveRate =
      currentBallotState === BallotState.Active
        ? metadata.reconfigurationBondingCurveRate
        : metadata.bondingCurveRate

    const base =
      totalSupply && currentOverflow && tokenAmount
        ? currentOverflow.mul(parseWad(tokenAmount)).div(totalSupply)
        : BigNumber.from(0)

    if (!bondingCurveRate || !base || !currentOverflow) return

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
