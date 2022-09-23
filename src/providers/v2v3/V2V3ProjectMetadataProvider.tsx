import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { PropsWithChildren, useContext } from 'react'

export default function V2V3ProjectMetadataProvider({
  projectId,
  metadata,
  children,
}: PropsWithChildren<{
  projectId: number
  metadata: ProjectMetadataV5
}>) {
  const { cv } = useContext(V2V3ContractsContext)
  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || metadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{ projectMetadata: metadata, isArchived, projectId, cv }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
