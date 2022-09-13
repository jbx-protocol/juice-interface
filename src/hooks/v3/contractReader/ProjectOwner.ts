import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3ContractName } from 'models/v3/contracts'
import { useContext } from 'react'

import useContractReader from './V3ContractReader'

/** Returns address of project owner. */
export default function useProjectOwner(projectId: number | undefined) {
  const { isPreviewMode } = useContext(V3ProjectContext)

  return useContractReader<string>({
    contract: V3ContractName.JBProjects,
    functionName: 'ownerOf',
    args: projectId && !isPreviewMode ? [projectId] : null,
  })
}
