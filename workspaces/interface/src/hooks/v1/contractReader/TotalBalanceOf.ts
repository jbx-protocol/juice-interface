import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'models/v1/contracts'
import { V1TerminalName } from 'models/v1/terminals'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './ContractReader'
import useShouldUpdateTokens from './ShouldUpdateTokens'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
  terminalName: V1TerminalName | undefined,
) {
  return useContractReader<BigNumber>({
    contract: V1ContractName.TicketBooth,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
