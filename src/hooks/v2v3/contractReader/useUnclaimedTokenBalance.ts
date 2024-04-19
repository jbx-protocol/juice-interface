import { V2V3ContractName } from 'models/v2v3/contracts'
import { toHexString } from 'utils/bigNumbers'
import useContractReader from './useV2ContractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export function useUnclaimedTokenBalance({
  projectId,
  userAddress,
}: {
  projectId: number | undefined
  userAddress: string | undefined
}) {
  return useContractReader<bigint>({
    contract: V2V3ContractName.JBTokenStore,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, toHexString(BigInt(projectId))]
        : null,
  })
}
