import { ipfsGetWithFallback } from 'lib/api/ipfs'
import { consolidateMetadata, ProjectMetadataV5 } from 'models/project-metadata'
import { useQuery } from 'react-query'

export function useProjectMetadata(uri: string | undefined) {
  return useQuery(
    ['project-metadata', uri],
    async () => {
      if (!uri) {
        throw new Error('Project URI not specified.')
      }

      const response = await ipfsGetWithFallback<ProjectMetadataV5>(uri)
      return consolidateMetadata(response.data)
    },
    {
      enabled: !!uri,
      staleTime: 60000,
    },
  )
}
