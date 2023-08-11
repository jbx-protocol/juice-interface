import { ProjectMetadata } from 'models/projectMetadata'
import { useMemo } from 'react'

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

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}
