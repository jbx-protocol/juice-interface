import axios from 'axios'
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

      const response = await axios.get<{ handle: string }>(
        `/api/juicebox/projectHandle/${projectId}`,
      )
      return response.data.handle
    },
    {
      enabled: !!projectId,
    },
  )
}
