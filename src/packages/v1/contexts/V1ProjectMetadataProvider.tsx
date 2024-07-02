import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { ProjectMetadata } from 'models/projectMetadata'
import useProjectIdForHandle from 'packages/v1/hooks/contractReader/useProjectIdForHandle'
import { PropsWithChildren } from 'react'
import { isHardArchived } from 'utils/archived'

export function V1ProjectMetadataProvider({
  handle,
  metadata,
  children,
}: PropsWithChildren<{
  handle: string
  metadata: ProjectMetadata | undefined
}>) {
  const { data: projectId } = useProjectIdForHandle(handle)

  const isArchived =
    ((projectId &&
      isHardArchived({ pv: PV_V1, projectId: projectId.toNumber() })) ||
      metadata?.archived) ??
    false

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
        pv: PV_V1,
      }}
    >
      {children}
    </ProjectMetadataContext.Provider>
  )
}
