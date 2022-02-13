/* eslint-disable*/
import axios from 'axios'

import { consolidateMetadata } from 'models/project-metadata'
import { useQuery } from 'react-query'
import { ipfsCidUrl } from 'utils/ipfs'

export default function useV2ProjectMetadata(metadataUri?: string) {
  return useQuery(
    ['v2-project-metadata', metadataUri],
    async () => {
      if (!metadataUri) {
        return
      }

      const url = ipfsCidUrl(metadataUri)

      const response = await axios.get(url)
      return consolidateMetadata(response.data)
    },
    {
      enabled: Boolean(metadataUri),
      retry: false,
      refetchOnWindowFocus: false,
    },
  )
}
