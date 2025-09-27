import { useJBProjectMetadataContext } from 'juice-sdk-react'
import { wrapNonAnchorsInAnchor } from 'utils/wrapNonAnchorsInAnchor'

export type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export const useV4AboutPanel = () => {
  const { metadata } = useJBProjectMetadataContext()
  const projectMetadata = metadata?.data

  const description = projectMetadata?.description
    ? addHttpsToDescriptionUrls(
        wrapNonAnchorsInAnchor(projectMetadata?.description),
      )
    : undefined


  return {
    description,
    projectName: projectMetadata?.name,
  }
}

const addHttpsToDescriptionUrls = (description: string) => {
  // find all dangling a hrefs missing a https:// or http:// or any protocol and add https://
  const urlRegex = /<a href="((?!http|https).+?)"/g
  return description.replace(urlRegex, '<a href="https://$1"')
}
