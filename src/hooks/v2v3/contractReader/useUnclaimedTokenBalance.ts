import { BigNumber } from 'ethers'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { Contract } from 'ethers'
import { V2V3ContractName } from 'models/v2v3/contracts'
import useContractReader from './useV2ContractReader'

/** Returns unclaimed balance of user with `userAddress`. */
export function useUnclaimedTokenBalance({
  projectId,
  userAddress,
  JBTokenStore,
}: {
  projectId: number | undefined
  userAddress: string | undefined
  JBTokenStore?: Contract
}) {
  return useContractReader<BigNumber>({
    contract: JBTokenStore ?? V2V3ContractName.JBTokenStore,
    functionName: 'unclaimedBalanceOf',
    args:
      userAddress && projectId
        ? [userAddress, BigNumber.from(projectId).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
  })
}
