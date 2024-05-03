import { CV_V3 } from 'constants/cv'
import { JB721DelegateContractsProvider } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsProvider'
import { ProjectPageProps } from 'utils/server/pages/props'
import { NftRewardsProvider } from '../NftRewards/NftRewardsProvider'
import { V2V3ContractsProvider } from './Contracts/V2V3ContractsProvider'
import V2V3ProjectProvider from './Project/V2V3ProjectProvider'
import { V2V3ProjectContractsProvider } from './ProjectContracts/V2V3ProjectContractsProvider'
import V2V3ProjectMetadataProvider from './V2V3ProjectMetadataProvider'
import V2V3ProjectOFACProvider from './V2V3ProjectOFACProvider'

/**
 * Provide all the necessary contexts to render a V2V3 Project.
 */
export const V2V3ProjectPageProvider: React.FC<
  React.PropsWithChildren<ProjectPageProps>
> = ({ projectId, metadata, children }) => {
  return (
    <V2V3ContractsProvider initialCv={CV_V3}>
      <V2V3ProjectContractsProvider projectId={projectId}>
        <V2V3ProjectMetadataProvider projectId={projectId} metadata={metadata}>
          <V2V3ProjectProvider projectId={projectId}>
            <V2V3ProjectOFACProvider>
              <JB721DelegateContractsProvider>
                <NftRewardsProvider>{children}</NftRewardsProvider>
              </JB721DelegateContractsProvider>
            </V2V3ProjectOFACProvider>
          </V2V3ProjectProvider>
        </V2V3ProjectMetadataProvider>
      </V2V3ProjectContractsProvider>
    </V2V3ContractsProvider>
  )
}
