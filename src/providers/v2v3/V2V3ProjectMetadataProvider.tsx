import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import useProjectMetadataContent from 'hooks/v2v3/contractReader/ProjectMetadataContent'
import { PropsWithChildren, useContext } from 'react'

export default function V2V3ProjectMetadataProvider({
  projectId,
  children,
}: PropsWithChildren<{
  projectId: number
}>) {
  const { cv } = useContext(V2V3ContractsContext)

  const { data: metadataCid } = useProjectMetadataContent(projectId)
  const { data: metadata } = useProjectMetadata(metadataCid)

  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || metadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{
        projectMetadata: metadata,
        isArchived,
        projectId,
        cv,
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
