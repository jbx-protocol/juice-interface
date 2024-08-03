import { ProjectMetadata } from 'models/projectMetadata'
import { useMemo } from 'react'
import { stripHtmlTags } from 'utils/string'

export type SubtitleType = 'tagline' | 'description'

export const useSubtitle = (
  projectMetadata:
    | Pick<ProjectMetadata, 'projectTagline' | 'description'>
    | undefined,
) => {
  const subtitle = useMemo(() => {
    const tagline = projectMetadata?.projectTagline
    const description = projectMetadata?.description
      ? stripHtmlTags(projectMetadata?.description)
      : undefined

    if (tagline) {
      return {
        text: tagline,
        type: 'tagline' as SubtitleType,
      }
    }

    if (description) {
      return {
        text: description,
        type: 'description' as SubtitleType,
      }
    }
  }, [projectMetadata?.description, projectMetadata?.projectTagline])

  return subtitle
}
