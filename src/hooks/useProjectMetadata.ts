import { ipfsGet } from 'lib/api/ipfs'
import { AnyProjectMetadata, consolidateMetadata } from 'models/projectMetadata'
import { useQuery } from 'react-query'

export function useProjectMetadata(uri: string | null | undefined) {
  return useQuery(
    ['project-metadata', uri],
    async () => {
      if (!uri) {
        throw new Error('Project URI not specified.')
      }

      const response = await ipfsGet<AnyProjectMetadata>(uri)
      return consolidateMetadata(response.data)
    },
    {
      enabled: !!uri,
      staleTime: 60000,
    },
  )
}
