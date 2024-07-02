import { BigNumber, BigNumberish, Contract } from 'ethers'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './useV2ContractReader'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigNumberish | undefined,
  contract?: Contract,
) {
  return useContractReader<BigNumber>({
    contract: contract ?? V2V3ContractName.JBTokenStore,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
  })
}
