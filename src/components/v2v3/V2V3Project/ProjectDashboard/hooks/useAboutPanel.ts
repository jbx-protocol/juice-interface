import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useMemo } from 'react'
import { wrapNonAnchorsInAnchor } from 'utils/wrapNonAnchorsInAnchor'

export type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export const useAboutPanel = () => {
  const { projectMetadata } = useProjectMetadataContext()

  const description = useMemo(
    () =>
      projectMetadata?.description
        ? wrapNonAnchorsInAnchor(projectMetadata?.description)
        : undefined,
    [projectMetadata?.description],
  )

  return {
    description,
    projectName: projectMetadata?.name,
  }
}
