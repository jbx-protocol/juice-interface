import { loadURLContentType } from 'utils/http/loadURLContentType'

const supportedContentTypes = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
  'image/svg',
]

export const loadAllMediaLinksPerLine = async (
  urlsPerLine: Array<string[] | null>,
) => {
  const mediaLinksPerLine: Array<string[] | undefined> = []
  for (const urls of urlsPerLine) {
    if (!urls) {
      mediaLinksPerLine.push(undefined)
      continue
    }
    const mediaLinks = (
      await Promise.all(
        urls.map(async url => {
          if (!url) return undefined
          const contentType = (await loadURLContentType(url)) ?? ''
          if (!supportedContentTypes.includes(contentType)) return undefined
          return url
        }),
      )
    ).filter((url): url is string => !!url)
    mediaLinksPerLine.push(mediaLinks.length ? mediaLinks : undefined)
  }
  return mediaLinksPerLine
}
