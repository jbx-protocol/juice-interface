import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'

import useContractReader from './V2ContractReader'

/** Returns address of project owner. */
export default function useProjectOwner(projectId: number | undefined) {
  const { isPreviewMode } = useContext(V2V3ProjectContext)

  return useContractReader<string>({
    contract: V2V3ContractName.JBProjects,
    functionName: 'ownerOf',
    args: projectId && !isPreviewMode ? [projectId] : null,
  })
}
