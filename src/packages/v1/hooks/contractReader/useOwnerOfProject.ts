import { BigintIsh } from '@sushiswap/sdk'
import { V1ContractName } from 'packages/v1/models/contracts'
import useContractReader from './useContractReader'

/** Returns address of project owner. */
export default function useOwnerOfProject(projectId: BigintIsh | undefined) {
  return useContractReader<string>({
    contract: V1ContractName.Projects,
    functionName: 'ownerOf',
    args: projectId ? [projectId] : null,
  })
}
