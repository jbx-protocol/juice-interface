import Loading from 'components/Loading'
import ScrollToTopButton from 'components/ScrollToTopButton'
import { V2V3Project } from 'components/v2v3/V2V3Project'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { TransactionProvider } from 'providers/TransactionProvider'
import { NftRewardsProvider } from 'providers/v2v3/NftRewardsProvider'
import { VeNftProvider } from 'providers/v2v3/VeNftProvider'
import { useContext } from 'react'

export function V2V3Dashboard() {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const { cvsLoading } = useContext(V2V3ProjectContractsContext)

  if (cvsLoading || !projectMetadata) return <Loading />

  return (
    <div style={layouts.maxWidth}>
      <TransactionProvider>
        <NftRewardsProvider>
          <VeNftProvider projectId={projectId}>
            <V2V3Project />
          </VeNftProvider>
        </NftRewardsProvider>
      </TransactionProvider>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <ScrollToTopButton />
      </div>
    </div>
  )
}
