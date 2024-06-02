import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useMemo } from 'react'
import { linkUrl } from 'utils/url'

export const useSocialLinks = () => {
  const { projectMetadata } = useProjectMetadataContext()

  return useMemo(() => {
    return {
      twitter:
        projectMetadata?.twitter && projectMetadata.twitter.length
          ? `https://twitter.com/${projectMetadata.twitter}`
          : undefined,
      discord: linkOrUndefined(projectMetadata?.discord),
      telegram: linkOrUndefined(projectMetadata?.telegram),
      website: linkOrUndefined(projectMetadata?.infoUri),
    }
  }, [
    projectMetadata?.discord,
    projectMetadata?.infoUri,
    projectMetadata?.telegram,
    projectMetadata?.twitter,
  ])
}

const linkOrUndefined = (link: string | undefined) => {
  if (!link || !link.length) return undefined
  return linkUrl(link)
}
