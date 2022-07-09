import { TwitterOutlined } from '@ant-design/icons'
import Discord from 'components/icons/Discord'

import ExternalLink from '../../ExternalLink'

const prettyUrl = (url: string) => {
  if (url.startsWith('https://')) {
    return url.split('https://')[1]
  } else if (url.startsWith('http://')) {
    return url.split('http://')[1]
  } else return url
}

const linkUrl = (url: string) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return 'https://' + url
}
const spacing = 20

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
    <>
      {infoUri && (
        <ExternalLink
          style={{ fontWeight: 500, marginRight: spacing }}
          href={linkUrl(infoUri)}
        >
          {prettyUrl(infoUri)}
        </ExternalLink>
      )}
      {twitter && (
        <ExternalLink
          style={{
            fontWeight: 500,
            marginRight: spacing,
            whiteSpace: 'pre',
          }}
          href={'https://twitter.com/' + twitter}
        >
          <span style={{ marginRight: 4 }}>
            <TwitterOutlined />
          </span>
          @{prettyUrl(twitter)}
        </ExternalLink>
      )}
      {discord && (
        <ExternalLink
          style={{
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            marginRight: spacing,
            whiteSpace: 'pre',
          }}
          href={linkUrl(discord)}
        >
          <span style={{ display: 'flex', marginRight: 4 }}>
            <Discord size={13} />
          </span>
          Discord
        </ExternalLink>
      )}
    </>
  )
}
