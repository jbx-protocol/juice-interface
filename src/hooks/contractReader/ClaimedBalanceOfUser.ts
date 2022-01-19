import { BigNumber, BigNumberish } from 'ethers'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { TerminalName } from 'models/terminal-name'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns ERC20 balance of user with `userAddress`. */
export default function useClaimedBalanceOfUser(
  tokenAddress: string | undefined,
  userAddress: string | undefined,
  projectId?: BigNumberish,
  terminalName?: TerminalName,
) {
  return useContractReader<BigNumber>({
    contract: useErc20Contract(tokenAddress),
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
