import { VIDEO_FILE_TYPES } from 'constants/fileTypes'
import { loadURLContentType } from 'utils/http/loadURLContentType'

const supportedContentTypes = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
  'image/svg',
  'image/vnd.mozilla.apng',
  'image/webp',
].concat(VIDEO_FILE_TYPES)

export const loadAllMediaLinks = async (urlsPerLine: string[]) => {
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
  return mediaLinks
}
