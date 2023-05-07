import { fetchProjectHandle } from 'lib/api/juicebox'
import { useQuery } from 'react-query'

export default function useProjectHandle({
  projectId,
}: {
  projectId?: number
}) {
  return useQuery(
    ['project-handle', projectId],
    async () => {
      if (!projectId) {
        throw new Error('Project ID not specified.')
      }

      return await fetchProjectHandle(projectId)
    },
    {
      enabled: !!projectId,
    },
  )
}
