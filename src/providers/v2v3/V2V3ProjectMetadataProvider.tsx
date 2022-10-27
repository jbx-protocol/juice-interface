import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import useProjectMetadataContent from 'hooks/v2v3/contractReader/ProjectMetadataContent'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { PropsWithChildren, useContext } from 'react'

export default function V2V3ProjectMetadataProvider({
  projectId,
  metadata,
  children,
}: PropsWithChildren<{
  metadata: ProjectMetadataV5 | undefined
  projectId: number
}>) {
  const { cv } = useContext(V2V3ContractsContext)

  const hasMetadata = Boolean(metadata)

  const { data: metadataCid } = useProjectMetadataContent(
    hasMetadata ? projectId : undefined,
  )
  const { data: _metadata } = useProjectMetadata(metadataCid)

  const projectMetadata = metadata || _metadata

  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || projectMetadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{
        projectMetadata,
        isArchived,
        projectId,
        cv,
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
