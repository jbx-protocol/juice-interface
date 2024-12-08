import { SiteBaseUrl } from 'constants/url'
import { ProjectMetadata } from 'models/projectMetadata'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'
import { stripHtmlTags } from 'utils/string'
import { SEO } from './common/SEO/SEO'

const ProjectPageSEO: React.FC<{
  metadata?: ProjectMetadata
  url: string
}> = ({ metadata, url }) => (
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
    twitter={{
      card: 'summary',
      creator: metadata?.twitter,
      handle: metadata?.twitter,
      // Swap out all gateways with ipfs.io public gateway until we can resolve our meta tag issue.
      image: metadata?.logoUri
        ? ipfsPublicGatewayUrl(cidFromUrl(metadata.logoUri))
        : undefined,
    }}
  />
)

export const V2V3ProjectSEO: React.FC<{
  metadata?: ProjectMetadata
  projectId: number
}> = ({ metadata, projectId }) => (
  <ProjectPageSEO metadata={metadata} url={`${SiteBaseUrl}v2/p/${projectId}`} />
)

export const V4ProjectSEO: React.FC<{
  metadata?: ProjectMetadata
  chainName: string
  projectId: number
}> = ({ metadata, chainName, projectId }) => {
  return (
    <ProjectPageSEO
      metadata={metadata}
      url={`${SiteBaseUrl}v4/${chainName}/p/${projectId}`}
    />
  )
}
