import Loading from 'components/shared/Loading'
import Project404 from 'components/shared/Project404'
import V2Dashboard from 'components/v2/V2Dashboard'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useParams } from 'react-router-dom'

export default function V2DashboardGateway() {
  const { handle, projectId }: { handle?: string; projectId?: string } =
    useParams()

  // Try parsing projectId as int
  const _projectId =
    projectId && !isNaN(parseInt(projectId)) ? parseInt(projectId) : undefined

  const { isLoading, data: projects } = useSubgraphQuery(
    handle
      ? {
          entity: 'project',
          keys: ['projectId'],
          where: [
            { key: 'cv', value: '2' },
            { key: 'handle', value: handle },
          ],
        }
      : null,
  )

  if (_projectId) return <V2Dashboard projectId={_projectId} />

  if (isLoading) return <Loading />

  if (!projects?.length) {
    return handle ? (
      <Project404 handle={handle} />
    ) : (
      <Project404 projectId={_projectId} />
    )
  }

  return <V2Dashboard projectId={projects[0].projectId} />
}
