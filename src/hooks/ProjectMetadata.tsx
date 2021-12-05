import Axios from 'axios'
import { consolidateMetadata, ProjectMetadataV3 } from 'models/project-metadata'
import { useEffect, useState } from 'react'
import { ipfsCidUrl } from 'utils/ipfs'

export async function getProjectMetadata(
  ipfsHash: string | undefined,
): Promise<ProjectMetadataV3 | undefined> {
  if (!ipfsHash) return

  let res
  try {
    const ipfsUrl = ipfsCidUrl(ipfsHash)
    res = await Axios.get(ipfsUrl)
  } catch (e) {
    console.error('Error getting metadata for uri', ipfsHash, e)
  }
  return res ? consolidateMetadata(res.data) : undefined
}

export function useProjectMetadata(ipfsHash: string | undefined) {
  const [metadata, setMetadata] = useState<ProjectMetadataV3>()

  useEffect(() => {
    const _getProjectMetaData = async (_ipfsHash: string | undefined) => {
      const metadata = await getProjectMetadata(_ipfsHash)
      setMetadata(metadata)
    }
    _getProjectMetaData(ipfsHash)
  }, [ipfsHash])

  return metadata
}
