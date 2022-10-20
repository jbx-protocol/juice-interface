import { useAppSelector } from 'hooks/AppSelector'
import { useCallback } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'

/**
 * Hook that returns a function that uploads project metadata to IPFS.
 * @returns A function that uploads project metadata to IPFS.
 * @throws An error if the project metadata could not be uploaded.
 */
export const useUploadProjectMetadata = () => {
  const { projectMetadata } = useAppSelector(state => state.editingV2Project)
  return useCallback(async () => {
    const hash = (await uploadProjectMetadata(projectMetadata)).IpfsHash
    if (!hash.length) {
      console.error('Failed to upload project metadata', {
        hash,
        inputProjectMetadata: projectMetadata,
      })
      throw new Error('Failed to upload project metadata')
    }
    return hash
  }, [projectMetadata])
}
