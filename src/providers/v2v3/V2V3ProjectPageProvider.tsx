import { ProjectPageProps } from 'utils/server/pages/props'
import { useSetCv, V2V3ContractsProvider } from './V2V3ContractsProvider'
import { V2V3ProjectContractsProvider } from './V2V3ProjectContractsProvider'
import V2V3ProjectMetadataProvider from './V2V3ProjectMetadataProvider'
import V2V3ProjectProvider from './V2V3ProjectProvider'

/**
 * Provide all the necessary contexts to render a V2V3 Project.
 */
export const V2V3ProjectPageProvider: React.FC<ProjectPageProps> = ({
  projectId,
  children,
}) => {
  useSetCv(projectId)

  return (
    <V2V3ContractsProvider>
      <V2V3ProjectContractsProvider projectId={projectId}>
        <V2V3ProjectMetadataProvider projectId={projectId}>
          <V2V3ProjectProvider projectId={projectId}>
            {children}
          </V2V3ProjectProvider>
        </V2V3ProjectMetadataProvider>
      </V2V3ProjectContractsProvider>
    </V2V3ContractsProvider>
  )
}
