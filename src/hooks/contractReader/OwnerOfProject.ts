import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'

import useContractReader from './ContractReader'

/** Returns address of project owner. */
export default function useOwnerOfProject(projectId: BigNumberish | undefined) {
  return useContractReader<string>({
    contract: ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
