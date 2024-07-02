import { Contract } from 'ethers'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1ContractName } from 'packages/v1/models/contracts'
import { useContext } from 'react'
import { bigintsDiff } from 'utils/bigNumbers'
import useContractReader from './useContractReader'
import useShouldUpdateTokens from './useShouldUpdateTokens'

/** Returns unclaimed balance of user with `userAddress`. */
export function useV1UnclaimedBalance({
  projectId,
  userAddress,
  TicketBooth,
}: {
  projectId: number | undefined
  userAddress: string | undefined
  TicketBooth?: Contract
}) {
  const { terminal } = useContext(V1ProjectContext)

  return useContractReader<bigint>({
    contract: TicketBooth ?? V1ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args: userAddress && projectId ? [userAddress, projectId] : null,
    valueDidChange: bigintsDiff,
    updateOn: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
