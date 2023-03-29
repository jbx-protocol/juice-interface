import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1ContractName } from 'models/v1/contracts'
import { useContext } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'
import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

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

  return useContractReader<BigNumber>({
    contract: TicketBooth ?? V1ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args: userAddress && projectId ? [userAddress, projectId] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminal?.name, userAddress),
  })
}
