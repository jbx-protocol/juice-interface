import Loading from 'components/Loading'
import ScrollToTopButton from 'components/ScrollToTopButton'
import { V2V3Project } from 'components/v2v3/V2V3Project'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { TransactionProvider } from 'providers/TransactionProvider'
import { VeNftProvider } from 'providers/v2v3/VeNftProvider'
import { useContext } from 'react'

export function V2V3Dashboard() {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const {
    loading: { cvsLoading },
  } = useContext(V2V3ProjectContractsContext)

  if (cvsLoading || !projectMetadata) return <Loading />

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
