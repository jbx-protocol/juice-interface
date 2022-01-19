import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { TerminalName } from 'models/terminal-name'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOfUser(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
  terminalName?: TerminalName,
) {
  return useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
