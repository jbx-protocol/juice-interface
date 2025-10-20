import { SiteBaseUrl } from 'constants/url'
import { JBChainId, toJbUrn } from 'juice-sdk-core'
import { ProjectMetadata } from 'models/projectMetadata'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'
import { stripHtmlTags } from 'utils/string'
import { SEOHead } from './SEOHead'

const ProjectPageSEO: React.FC<{
  metadata?: ProjectMetadata
  url: string
}> = ({ metadata, url }) => {
  // Use project logo for both Twitter and Open Graph
  const projectImage = metadata?.logoUri
    ? ipfsPublicGatewayUrl(cidFromUrl(metadata.logoUri))
    : undefined

  const description = metadata?.projectTagline
    ? metadata.projectTagline
    : metadata?.description
    ? stripHtmlTags(metadata.description)
    : undefined

  return (
    <SEOHead
      title={metadata?.name}
      url={url}
      description={description}
      image={projectImage}
      twitterCard="summary_large_image"
      twitterCreator={metadata?.twitter}
    />
  )
}

export const V2V3ProjectSEO: React.FC<{
  metadata?: ProjectMetadata
  projectId: number
}> = ({ metadata, projectId }) => (
  <ProjectPageSEO metadata={metadata} url={`${SiteBaseUrl}v2/p/${projectId}`} />
)

export const V4ProjectSEO: React.FC<{
  metadata?: ProjectMetadata
  chainId: JBChainId
  projectId: number
}> = ({ metadata, chainId, projectId }) => {
  const urn = toJbUrn(chainId, BigInt(projectId))
  return <ProjectPageSEO metadata={metadata} url={`${SiteBaseUrl}v4/${urn}`} />
}

export const V5ProjectSEO: React.FC<{
  metadata?: ProjectMetadata
  chainId: JBChainId
  projectId: number
}> = ({ metadata, chainId, projectId }) => {
  const urn = toJbUrn(chainId, BigInt(projectId))
  return <ProjectPageSEO metadata={metadata} url={`${SiteBaseUrl}v5/${urn}`} />
}
