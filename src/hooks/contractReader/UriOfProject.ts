import { BigNumber, BigNumberish } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'

import useContractReader from './ContractReader'

/** Returns URI for project with `projectId`. */
export default function useUriOfProject(projectId: BigNumberish | undefined) {
  return useContractReader<string>({
    contract: V1ContractName.Projects,
    functionName: 'uriOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
