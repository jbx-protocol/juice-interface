import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useMemo } from 'react'
import { linkUrl } from 'utils/url'
import { wrapNonAnchorsInAnchor } from 'utils/wrapNonAnchorsInAnchor'

export type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export const useAboutPanel = () => {
  const { projectMetadata } = useProjectMetadataContext()

  const socialLinks: Record<SocialLink, string | undefined> = useMemo(() => {
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
  const description = useMemo(
    () =>
      projectMetadata?.description
        ? wrapNonAnchorsInAnchor(projectMetadata?.description)
        : undefined,
    [projectMetadata?.description],
  )

  return {
    description,
    socialLinks,
    projectName: projectMetadata?.name,
  }
}

const linkOrUndefined = (link: string | undefined) => {
  if (!link || !link.length) return undefined
  return linkUrl(link)
}
