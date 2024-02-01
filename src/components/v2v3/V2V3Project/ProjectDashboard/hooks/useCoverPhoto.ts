import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'

export const useCoverPhoto = () => {
  const { projectMetadata } = useProjectMetadataContext()
  const coverImageUrl = projectMetadata?.coverImageUri
    ? ipfsUriToGatewayUrl(projectMetadata?.coverImageUri)
    : undefined
  const coverImageAltText = `Cover image for project ${projectMetadata?.name}`
  return {
    coverImageUrl,
    coverImageAltText,
  }
}
