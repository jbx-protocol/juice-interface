import { SiteBaseUrl } from 'constants/url'
import { JBChainId, toJbUrn } from 'juice-sdk-core'
import { ProjectMetadata } from 'models/projectMetadata'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'
import { stripHtmlTags } from 'utils/string'
import { SEO } from './common/SEO/SEO'

const ProjectPageSEO: React.FC<{
  metadata?: ProjectMetadata
  url: string
}> = ({ metadata, url }) => {
  // Use project logo for both Twitter and Open Graph
  const projectImage = metadata?.logoUri
    ? ipfsPublicGatewayUrl(cidFromUrl(metadata.logoUri))
    : undefined

  return (
    <SEO
      // Set known values, leave others undefined to be overridden
      title={metadata?.name}
      url={url}
      description={
        metadata?.projectTagline
          ? metadata.projectTagline
          : metadata?.description
          ? stripHtmlTags(metadata.description)
          : undefined
      }
      image={projectImage}
      twitter={{
        card: 'summary_large_image',
        creator: metadata?.twitter,
        handle: metadata?.twitter,
        image: projectImage,
      }}
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
  return (
    <ProjectPageSEO metadata={metadata} url={`${SiteBaseUrl}v4/p/${urn}`} />
  )
}

export const V5ProjectSEO: React.FC<{
  metadata?: ProjectMetadata
  chainId: JBChainId
  projectId: number
}> = ({ metadata, chainId, projectId }) => {
  const urn = toJbUrn(chainId, BigInt(projectId))
  return (
    <ProjectPageSEO metadata={metadata} url={`${SiteBaseUrl}v5/p/${urn}`} />
  )
}
