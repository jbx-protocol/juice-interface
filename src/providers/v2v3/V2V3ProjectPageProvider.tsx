import { V2CVType, V3CVType } from 'models/cv'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { V2V3ContractsProvider } from './V2V3ContractsProvider'
import { V2V3ProjectContractsProvider } from './V2V3ProjectContractsProvider'
import V2V3ProjectMetadataProvider from './V2V3ProjectMetadataProvider'
import V2V3ProjectProvider from './V2V3ProjectProvider'

/**
 * Provide all the necessary contexts to render a V2V3 Project.
 */
export const V2V3ProjectPageProvider: React.FC<{
  projectId: number
  metadata: ProjectMetadataV5
  cv: V3CVType | V2CVType
}> = ({ projectId, metadata, children, cv }) => {
  return (
    <V2V3ContractsProvider initialCv={cv}>
      <V2V3ProjectContractsProvider projectId={projectId}>
        <V2V3ProjectMetadataProvider projectId={projectId} metadata={metadata}>
          <V2V3ProjectProvider projectId={projectId}>
            {children}
          </V2V3ProjectProvider>
        </V2V3ProjectMetadataProvider>
      </V2V3ProjectContractsProvider>
    </V2V3ContractsProvider>
  )
}
