import Loading from 'components/Loading'
import Project404 from 'components/Project404'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useRouter } from 'next/router'
import { V2UserProvider } from 'providers/v2/UserProvider'

import V2Dashboard from './components/V2Dashboard'

enum ProjectIdType {
  ProjectId,
  Handle,
}

function getProjectIdOrHandle(
  projectId: string | undefined,
):
  | { type: ProjectIdType.ProjectId; projectId: number }
  | { type: ProjectIdType.Handle; handle: string }
  | undefined {
  if (!projectId?.length) return

  if (!isNaN(parseInt(projectId))) {
    return { type: ProjectIdType.ProjectId, projectId: parseInt(projectId) }
  }
  return { type: ProjectIdType.Handle, handle: projectId }
}

export default function V2ProjectPage() {
  const router = useRouter()
  const _projectId = router.query.projectId as string | undefined
  const projectIdOrHandle = getProjectIdOrHandle(_projectId)

  if (!projectIdOrHandle) {
    return <Project404 />
  }

  if (projectIdOrHandle.type === ProjectIdType.ProjectId) {
    return (
      <V2UserProvider>
        <V2Dashboard projectId={projectIdOrHandle.projectId} />
      </V2UserProvider>
    )
  }

  // Need to load subgraph query
  const { isLoading, data: projects } = useSubgraphQuery({
    entity: 'project',
    keys: ['projectId'],
    where: [
      { key: 'cv', value: '2' },
      { key: 'handle', value: projectIdOrHandle.handle },
    ],
  })

  if (isLoading) return <Loading />

  if (!projects?.length) {
    return <Project404 handle={projectIdOrHandle.handle} />
  }

  // If matching project found in query, return dashboard for that project.
  return (
    <V2UserProvider>
      <V2Dashboard projectId={projects[0].projectId} />
    </V2UserProvider>
  )
}
