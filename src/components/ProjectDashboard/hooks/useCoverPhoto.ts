import { ipfsUriToGatewayUrl } from 'utils/ipfs'
import { useProjectMetadata } from './useProjectMetadata'

export const useCoverPhoto = () => {
  const { projectMetadata } = useProjectMetadata()
  const coverImageUrl = projectMetadata?.coverImageUri
    ? ipfsUriToGatewayUrl(projectMetadata?.coverImageUri)
    : undefined
  const coverImageAltText = `Cover image for project ${projectMetadata?.name}`
  return {
    coverImageUrl,
    coverImageAltText,
  }
}
