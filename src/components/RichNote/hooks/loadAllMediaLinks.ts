import { MP4_FILE_TYPE } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer/NftUpload'
import { loadURLContentType } from 'utils/http/loadURLContentType'

const supportedContentTypes = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
  'image/svg',
  MP4_FILE_TYPE,
]

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
