import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { TerminalName } from 'models/terminal-name'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns unclaimed balance of user with `userAddress`. */
export default function useUnclaimedBalanceOfUser(
  userAddress: string | undefined,
  projectId?: BigNumberish,
  terminalName?: TerminalName,
) {
  return useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
