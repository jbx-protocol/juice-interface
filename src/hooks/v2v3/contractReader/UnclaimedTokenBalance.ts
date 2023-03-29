import { BigNumber } from '@ethersproject/bignumber'
import { bigNumbersDiff } from 'utils/bigNumbers'

import { Contract } from '@ethersproject/contracts'
import { V2V3ContractName } from 'models/v2v3/contracts'
import useContractReader from './V2ContractReader'

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
