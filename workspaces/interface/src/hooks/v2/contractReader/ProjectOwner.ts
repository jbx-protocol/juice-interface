import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2ContractName } from 'models/v2/contracts'
import { useContext } from 'react'

import useContractReader from './V2ContractReader'

/** Returns address of project owner. */
export default function useProjectOwner(projectId: number | undefined) {
  const { isPreviewMode } = useContext(V2ProjectContext)

  return useContractReader<string>({
    contract: V2ContractName.JBProjects,
    functionName: 'ownerOf',
    args: projectId && !isPreviewMode ? [projectId] : null,
  })
}
