import { useQuery } from '@tanstack/react-query'
import { ipfsFetch } from 'lib/api/ipfs'
import { AnyProjectMetadata, consolidateMetadata } from 'models/projectMetadata'
import { cidFromIpfsUri, cidFromUrl, isIpfsUri } from 'utils/ipfs'

export function useProjectMetadata(uri: string | null | undefined) {
  return useQuery({
    queryKey: ['project-metadata', uri],
    queryFn: async () => {
      if (!uri) {
        throw new Error('Project URI not specified.')
      }

      const response = await ipfsFetch<AnyProjectMetadata>(
        isIpfsUri(uri)
          ? cidFromIpfsUri(uri) ?? uri
          : uri.startsWith('https')
          ? cidFromUrl(uri) ?? uri
          : uri,
      )
      const metadata = consolidateMetadata(response.data)
      return metadata
    },

    enabled: !!uri,
  })
}
