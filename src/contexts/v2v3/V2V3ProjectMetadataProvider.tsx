import { PV_V2 } from 'constants/pv'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import useProjectMetadataContent from 'hooks/v2v3/contractReader/ProjectMetadataContent'
import { ProjectMetadata } from 'models/projectMetadata'
import { PropsWithChildren } from 'react'

export default function V2V3ProjectMetadataProvider({
  projectId,
  metadata,
  children,
}: PropsWithChildren<{
  metadata: ProjectMetadata | undefined
  projectId: number
}>) {
  const hasMetadata = Boolean(metadata)

  // only load metadata if it hasn't been previously loaded into the prop.
  const { data: metadataCid, refetchValue } = useProjectMetadataContent(
    !hasMetadata ? projectId : undefined,
  )
  const { data: _metadata } = useProjectMetadata(metadataCid)

  const projectMetadata = metadata ?? _metadata

  const isArchived = projectId
    ? V2ArchivedProjectIds.includes(projectId) || projectMetadata?.archived
    : false

  return (
    <ProjectMetadataContext.Provider
      value={{
        projectMetadata,
        isArchived,
        projectId,
        pv: PV_V2,
        refetchProjectMetadata: refetchValue,
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
