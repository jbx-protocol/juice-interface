import ScrollToTopButton from 'components/ScrollToTopButton'
import { V2V3Project } from 'components/v2v3/V2V3Project'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionProvider } from 'providers/TransactionProvider'
import { NftRewardsProvider } from 'providers/v2v3/NftRewardsProvider'
import { VeNftProvider } from 'providers/v2v3/VeNftProvider'
import { useContext } from 'react'

export function V2V3Dashboard() {
  const { projectId } = useContext(ProjectMetadataContext)

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
