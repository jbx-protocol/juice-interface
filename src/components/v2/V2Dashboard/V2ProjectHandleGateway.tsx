import Loading from 'components/shared/Loading'
import Project404 from 'components/shared/Project404'
import V2Dashboard from 'components/v2/V2Dashboard'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function V2ProjectHandleGateway() {
  const {
    handleOrProjectId,
    projectId,
  }: { handleOrProjectId?: string; projectId?: string } = useParams()

  /* 
  NOTE: In this implementation, projects using a number string as a handle (i.e. 123.eth) will load the project with projectId 123, not the project with handle '@123'.
  */

  // Try parsing handle from handleOrProjectId
  const handle =
    handleOrProjectId?.length && isNaN(parseInt(handleOrProjectId))
      ? handleOrProjectId
      : undefined

  // Try parsing _projectId from projectId then handleOrProjectId
  const _projectId =
    projectId && !isNaN(parseInt(projectId))
      ? parseInt(projectId)
      : handleOrProjectId && !isNaN(parseInt(handleOrProjectId))
      ? parseInt(handleOrProjectId)
      : undefined

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

  useEffect(() => {
    // If using projectId, redirect to dedicated projectId route
    if (_projectId && window.location.hash === '#/v2/p/' + _projectId) {
      window.location.hash = '#/v2/p/id/' + _projectId
    }
  }, [_projectId])

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
