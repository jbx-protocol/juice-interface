import { useQuery } from '@tanstack/react-query'
import { fetchProjectHandle } from 'lib/api/juicebox'

export default function useProjectHandle({
  projectId,
}: {
  projectId?: number
}) {
  return useQuery({
    queryKey: ['project-handle', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('Project ID not specified.')
      }

      return await fetchProjectHandle(projectId)
    },

    enabled: !!projectId,
  })
}
