import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { ProjectMetadata } from 'models/projectMetadata'
import useProjectMetadataContent from 'packages/v2v3/hooks/contractReader/useProjectMetadataContent'
import { PropsWithChildren } from 'react'
import { isHardArchived } from 'utils/archived'

export default function V2V3ProjectMetadataProvider({
  projectId,
  metadata,
  children,
}: PropsWithChildren<{
  metadata: ProjectMetadata | undefined
  projectId: number
}>) {
  const hasMetadata = Boolean(metadata)
  console.info('🧃 Server metadata', metadata)

  // only load metadata if it hasn't been previously loaded into the prop.
  const { data: metadataCid, refetchValue } = useProjectMetadataContent(
    !hasMetadata ? projectId : undefined,
  )
  const { data: _metadata } = useProjectMetadata(metadataCid)

  const projectMetadata = metadata ?? _metadata

  const isArchived =
    ((projectId && isHardArchived({ pv: PV_V2, projectId })) ||
      projectMetadata?.archived) ??
    false

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
