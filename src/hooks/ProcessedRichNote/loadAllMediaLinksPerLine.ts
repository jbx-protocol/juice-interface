import { loadURLContentType } from 'utils/http/loadURLContentType'

const supportedContentTypes = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
  'image/svg',
]

export const loadAllMediaLinksPerLine = async (urlsPerLine: string[]) => {
  const mediaLinksPerLine: Array<string[] | undefined> = []
  const mediaLinks = (
    await Promise.all(
      urlsPerLine.map(async url => {
        if (!url) return undefined
        const contentType = (await loadURLContentType(url)) ?? ''
        if (!supportedContentTypes.includes(contentType)) return undefined
        return url
      }),
    )
  ).filter((url): url is string => !!url)
  mediaLinksPerLine.push(mediaLinks.length ? mediaLinks : undefined)
  return mediaLinksPerLine
}
