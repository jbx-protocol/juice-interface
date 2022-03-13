import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'models/v1/contracts'

import useContractReader from './ContractReader'

/** Returns address of project owner. */
export default function useOwnerOfProject(projectId: BigNumberish | undefined) {
  return useContractReader<string>({
    contract: V1ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
