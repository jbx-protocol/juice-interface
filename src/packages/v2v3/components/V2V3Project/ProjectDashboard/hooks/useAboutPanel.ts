import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useMemo } from 'react'
import { wrapNonAnchorsInAnchor } from 'utils/wrapNonAnchorsInAnchor'

export type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export const useAboutPanel = () => {
  const { projectMetadata } = useProjectMetadataContext()

  const description = useMemo(
    () =>
      projectMetadata?.description
        ? addHttpsToDescriptionUrls(
            wrapNonAnchorsInAnchor(projectMetadata?.description),
          )
        : undefined,
    [projectMetadata?.description],
  )

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
