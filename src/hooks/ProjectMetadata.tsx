import Axios from 'axios'
import { consolidateMetadata, ProjectMetadataV3 } from 'models/project-metadata'
import { useCallback, useEffect, useState } from 'react'
import { ipfsCidUrl } from 'utils/ipfs'

export function useProjectMetadata(uri: string | undefined) {
  const [metadata, setMetadata] = useState<ProjectMetadataV3>()

  const getMetadata = useCallback(
    async (url: string) => {
      try {
        await Axios.get(url).then(res =>
          setMetadata(consolidateMetadata(res.data)),
        )
      } catch (e) {
        console.error('Error getting metadata for uri', uri, e)
      }
    },
    [uri],
  )

  useEffect(() => {
    uri && getMetadata(ipfsCidUrl(uri))
  }, [getMetadata, uri])

  return metadata
}
