import { BigNumber, BigNumberish, Contract } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'
import { V1TerminalName } from 'models/v1/terminals'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './useContractReader'
import useShouldUpdateTokens from './useShouldUpdateTokens'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
  terminalName?: V1TerminalName,
  contract?: Contract,
) {
  return useContractReader<BigNumber>({
    contract: contract ?? V1ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
