import { TwitterOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import { linkUrl, prettyUrl } from 'utils/url'

export default function SocialLinks({
  infoUri,
  twitter,
  discord,
}: {
  infoUri?: string
  twitter?: string
  discord?: string
}) {
  return (
    <Space className="flex-wrap gap-x-6 gap-y-2" size="middle">
      {infoUri && (
        <span>
          <ExternalLink
            className="block max-w-xs overflow-hidden text-ellipsis whitespace-pre font-medium"
            href={linkUrl(infoUri)}
          >
            {prettyUrl(infoUri)}
          </ExternalLink>
        </span>
      )}
      {twitter && (
        <ExternalLink
          className="block max-w-xs overflow-hidden text-ellipsis whitespace-pre font-medium"
          href={'https://twitter.com/' + twitter}
        >
          <span className="mr-1">
            <TwitterOutlined />
          </span>
          @{prettyUrl(twitter)}
        </ExternalLink>
      )}
      {discord && (
        <ExternalLink
          className="block max-w-xs overflow-hidden text-ellipsis whitespace-pre font-medium"
          href={linkUrl(discord)}
        >
          <span className="mr-1">
            <Discord size={11} />
          </span>
          Discord
        </ExternalLink>
      )}
    </Space>
  )
}
