import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'

import useContractReader from './ContractReader'

/** Returns URI for project with `projectId`. */
export default function useUriOfProject(projectId: BigNumberish | undefined) {
  return useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'uriOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
