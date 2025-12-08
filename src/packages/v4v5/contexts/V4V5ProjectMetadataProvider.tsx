import { useJBProjectMetadataContext } from 'juice-sdk-react'

import { PV_V4 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { PropsWithChildren } from 'react'

export default function V4V5ProjectMetadataProvider({
  projectId,
  children,
}: PropsWithChildren<{
  projectId: bigint
}>) {
  const _projectId = Number(projectId)

  const { metadata } = useJBProjectMetadataContext()

  const projectMetadata = metadata?.data ?? undefined
  const isLoading = metadata?.isLoading ?? true

  const isArchived = false

  return (
    <ProjectMetadataContext.Provider
      value={{
        projectMetadata,
        isArchived,
        projectId: _projectId,
        pv: PV_V4,
        isLoading,
        refetchProjectMetadata: () => null, // TODO
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
