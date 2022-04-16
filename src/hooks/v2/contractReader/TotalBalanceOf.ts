import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './V2ContractReader'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
) {
  return useContractReader<BigNumber>({
    contract: V2ContractName.JBTokenStore,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    // TODO: updateOn: useShouldUpdateTokens(projectId, terminalName, userAddress),
  })
}
