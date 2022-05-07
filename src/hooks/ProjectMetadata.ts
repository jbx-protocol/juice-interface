import axios from 'axios'
import { consolidateMetadata } from 'models/project-metadata'
import { ipfsCidUrl } from 'utils/ipfs'
import { useQuery } from 'react-query'

export function useProjectMetadata(uri: string | undefined) {
  return useQuery(
    ['project-metadata', uri],
    async () => {
      if (!uri) {
        throw new Error('Project URI not specified.')
      }

      const url = ipfsCidUrl(uri)
      const response = await axios.get(url)
      return consolidateMetadata(response.data)
    },
    {
      enabled: !!uri,
      staleTime: 60000,
    },
  )
}
