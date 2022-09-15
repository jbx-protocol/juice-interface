import { V2ArchivedProjectIds } from 'constants/v2/archivedProjects'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { PropsWithChildren } from 'react'

export default function V2ProjectMetadataProvider({
  projectId,
  metadata,
  children,
}: PropsWithChildren<{
  projectId: number
  metadata: ProjectMetadataV4
}>) {
  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || metadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{ projectMetadata: metadata, isArchived }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
