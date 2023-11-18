import { ProjectSafeDashboard } from 'components/ProjectSafeDashboard/ProjectSafeDashboard'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3ProjectPageProvider } from 'contexts/v2v3/V2V3ProjectPageProvider'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'
import { v2v3ProjectRoute } from 'utils/routes'

function V2V3ProjectSafeDashboard() {
  const { handle, projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <ProjectSafeDashboard
      projectPageUrl={v2v3ProjectRoute({ handle, projectId })}
      projectOwnerAddress={projectOwnerAddress}
    />
  )
}

export default function V2V3ProjectSafeDashboardPage() {
  const router = useRouter()

  const { projectId: rawProjectId } = router.query
  if (!rawProjectId) return null

  const projectId = parseInt(rawProjectId as string)

  return (
    <AppWrapper>
      <V2V3ProjectPageProvider projectId={projectId}>
        <TransactionProvider>
          <V2V3ProjectSafeDashboard />
        </TransactionProvider>
      </V2V3ProjectPageProvider>
    </AppWrapper>
  )
}

export const getServerSideProps = globalGetServerSideProps
