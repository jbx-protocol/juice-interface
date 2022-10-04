import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import useProjectIdForHandle from 'hooks/v1/contractReader/ProjectIdForHandle'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { PropsWithChildren } from 'react'
import { getTerminalVersion } from 'utils/v1/terminals'

export function V1ProjectMetadataProvider({
  handle,
  metadata,
  children,
}: PropsWithChildren<{
  handle: string
  metadata: ProjectMetadataV5
}>) {
  const projectId = useProjectIdForHandle(handle)

  const terminalAddress = useTerminalOfProject(projectId)
  const terminalVersion = getTerminalVersion(terminalAddress)

  const isArchived = projectId
    ? V1ArchivedProjectIds.includes(projectId.toNumber()) || metadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{
        projectMetadata: metadata,
        isArchived,
        projectId: projectId?.toNumber(),
        cv: terminalVersion,
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
