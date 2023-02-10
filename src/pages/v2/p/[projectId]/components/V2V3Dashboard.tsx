import Loading from 'components/Loading'
import ScrollToTopButton from 'components/ScrollToTopButton'
import { V2V3Project } from 'components/v2v3/V2V3Project'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { VeNftProvider } from 'contexts/VeNft/VeNftProvider'
import { useContext } from 'react'

export function V2V3Dashboard() {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)

  if (!projectMetadata) return <Loading />

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <TransactionProvider>
        <VeNftProvider projectId={projectId}>
          <V2V3Project />
        </VeNftProvider>
      </TransactionProvider>

      <div className="mt-12 text-center">
        <ScrollToTopButton />
      </div>
    </div>
  )
}
