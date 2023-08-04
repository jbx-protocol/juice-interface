import { useMemo } from 'react'
import { linkUrl } from 'utils/url'
import { useProjectMetadata } from './useProjectMetadata'

export type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export const useAboutPanel = () => {
  const { projectMetadata } = useProjectMetadata()

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

const wrapNonAnchorsInAnchor = (text: string) => {
  const urlRegex =
    /\b((http|https):\/\/[a-zA-Z0-9-._~:/?#@\\[\]!$&'()*+,;=%]+\b)/g

  return text.replace(urlRegex, url => {
    return '<a href="' + url + '">' + url + '</a>'
  })
}

const linkOrUndefined = (link: string | undefined) => {
  if (!link || !link.length) return undefined
  return linkUrl(link)
}
