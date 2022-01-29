import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'

import useContractReader from './ContractReader'

/** Returns URI for project with `projectId`. */
export default function useUriOfProject(projectId: BigNumberish | undefined) {
  return useContractReader<string>({
    contract: JuiceboxV1ContractName.Projects,
    functionName: 'uriOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
