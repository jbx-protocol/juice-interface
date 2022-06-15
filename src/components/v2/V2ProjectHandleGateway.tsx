import Loading from 'components/shared/Loading'
import Project404 from 'components/shared/Project404'
import V2Dashboard from 'components/v2/V2Dashboard'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useParams } from 'react-router-dom'

export default function V2ProjectHandleGateway() {
  const { handleOrProjectId }: { handleOrProjectId?: string } = useParams()

  const isHandle =
    handleOrProjectId?.length && isNaN(parseInt(handleOrProjectId))

  /* 
  NOTE: In this implementation, projects using a number string as a handle (i.e. 123.eth) will load the project with projectId 123, not the project with handle '@123'. We should use a second route (i.e. /v2/p/id/:id) to load projects by ID. But since this is an edge case and changing the URL structure could inconvenience projects, we'll use this for the short term. 
  */
  const { isLoading, data: projects } = useSubgraphQuery(
    handleOrProjectId?.length
      ? isHandle
        ? // Load project using handle
          {
            entity: 'project',
            keys: ['projectId'],
            where: [
              { key: 'handle', value: handleOrProjectId },
              { key: 'cv', value: '2' },
            ],
          }
        : // Load project using projectId
          {
            entity: 'project',
            keys: ['projectId'],
            where: [
              { key: 'projectId', value: parseInt(handleOrProjectId) },
              { key: 'cv', value: '2' },
            ],
          }
      : null,
  )

  if (isLoading) return <Loading />

  if (!projects?.length) {
    return isHandle ? (
      <Project404 handle={handleOrProjectId} />
    ) : (
      <Project404 projectId={handleOrProjectId} />
    )
  }

  return <V2Dashboard projectId={projects[0].projectId} />
}
