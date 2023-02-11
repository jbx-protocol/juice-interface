import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useProjectIdForHandle from 'hooks/v1/contractReader/ProjectIdForHandle'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import { ProjectMetadataV6 } from 'models/projectMetadata'
import { PropsWithChildren } from 'react'
import { getTerminalVersion } from 'utils/v1/terminals'

export function V1ProjectMetadataProvider({
  handle,
  metadata,
  children,
}: PropsWithChildren<{
  handle: string
  metadata: ProjectMetadataV6 | undefined
}>) {
  const { data: projectId } = useProjectIdForHandle(handle)

  const terminalAddress = useTerminalOfProject(projectId)
  const terminalVersion = getTerminalVersion(terminalAddress)

  const isArchived = projectId
    ? V1ArchivedProjectIds.includes(projectId.toNumber()) || metadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{
        refetchProjectMetadata: () => {
          throw new Error(
            'V1ProjectMetadataProvider.refetchProjectMetadata called but is not implemented',
          )
        },
        projectMetadata: metadata,
        isArchived,
        projectId: projectId?.toNumber(),
        pv: terminalVersion,
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
