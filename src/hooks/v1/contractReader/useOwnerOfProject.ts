import { V1ContractName } from 'models/v1/contracts'

import { BigintIsh } from 'utils/bigNumbers'
import useContractReader from './useContractReader'

/** Returns address of project owner. */
export default function useOwnerOfProject(projectId: BigintIsh | undefined) {
  return useContractReader<string>({
    contract: V1ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [projectId] : null,
  })
}
