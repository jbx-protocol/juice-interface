import { ProjectSafeDashboard } from 'components/ProjectSafeDashboard/ProjectSafeDashboard'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { useRouter } from 'next/router'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1ProjectProvider } from 'packages/v1/contexts/Project/V1ProjectProvider'
import { V1UserProvider } from 'packages/v1/contexts/User/V1UserProvider'
import { V1ProjectMetadataProvider } from 'packages/v1/contexts/V1ProjectMetadataProvider'
import { useContext } from 'react'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

function V1ProjectSafeDashboard({ handle }: { handle: string }) {
  const { owner } = useContext(V1ProjectContext)

  return (
    <ProjectSafeDashboard
      projectPageUrl={`/p/${handle}`}
      projectOwnerAddress={owner}
    />
  )
}

export default function V1ProjectSafeDashboardPage() {
  const router = useRouter()

  const { handle } = router.query as { handle: string }
  if (!handle) return null

  return (
    <AppWrapper>
      <V1UserProvider>
        <V1ProjectMetadataProvider handle={handle} metadata={undefined}>
          <V1ProjectProvider handle={handle}>
            <V1ProjectSafeDashboard handle={handle} />
          </V1ProjectProvider>
        </V1ProjectMetadataProvider>
      </V1UserProvider>
    </AppWrapper>
  )
}

export const getServerSideProps = globalGetServerSideProps
