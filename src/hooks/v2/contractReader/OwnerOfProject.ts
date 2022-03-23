import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useContractReader from './V2ContractReader'

/** Returns address of project owner. */
export default function useOwnerOfProject(projectId: BigNumberish | undefined) {
  return useContractReader<string>({
    contract: V2ContractName.JBProjects,
    functionName: 'ownerOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
