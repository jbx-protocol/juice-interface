import { ProjectSafeDashboard } from 'components/ProjectSafeDashboard/ProjectSafeDashboard'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { useRouter } from 'next/router'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { V2V3ProjectPageProvider } from 'packages/v2v3/contexts/V2V3ProjectPageProvider'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { useContext } from 'react'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

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
