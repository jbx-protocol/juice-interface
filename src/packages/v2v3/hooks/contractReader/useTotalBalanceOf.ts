import { Contract } from 'ethers'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { BigintIsh, bigintsDiff, toHexString } from 'utils/bigNumbers'
import useContractReader from './useV2ContractReader'

/** Returns combined ERC20 + unclaimed balance of user with `userAddress`. */
export default function useTotalBalanceOf(
  userAddress: string | undefined,
  projectId: BigintIsh | undefined,
  contract?: Contract,
) {
  return useContractReader<bigint>({
    contract: contract ?? V2V3ContractName.JBTokenStore,
    functionName: 'balanceOf',
    args:
      userAddress && projectId
        ? [userAddress, toHexString(BigInt(projectId))]
        : null,
    valueDidChange: bigintsDiff,
  })
}
