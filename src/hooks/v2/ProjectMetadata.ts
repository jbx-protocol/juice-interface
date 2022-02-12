import axios from 'axios'

import { consolidateMetadata } from 'models/project-metadata'
import { useQuery } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

export default function useV2ProjectMetadata(metadataCID?: string) {
  return useQuery(
    ['v2-project-metadata', metadataCID],
    async () => {
      if (!metadataCID) {
        return
      }

      const url = ipfsCidUrl(metadataCID)

      const response = await axios.get(url)
      return consolidateMetadata(response.data)
    },
    {
      enabled: Boolean(metadataCID),
      retry: false,
      refetchOnWindowFocus: false,
    },
  )
}
