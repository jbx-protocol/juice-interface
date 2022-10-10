import { TwitterOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import Discord from 'components/icons/Discord'
import TwitterVerified from 'components/Project/ProjectHeader/TwitterVerified'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { CSSProperties } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

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

const linkStyle: CSSProperties = {
  maxWidth: '20rem',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontWeight: 500,
  whiteSpace: 'pre',
  display: 'block',
}

export default function SocialLinks({
  infoUri,
  twitter,
  discord,
}: {
  infoUri?: string
  twitter?: string
  discord?: string
}) {
  const twitterVerifyEnabled = featureFlagEnabled(FEATURE_FLAGS.TWITTER_VERIFY)
  return (
    <Space
      size="middle"
      style={{ flexWrap: 'wrap', columnGap: '1.5rem', rowGap: '0.5rem' }}
    >
      {infoUri && (
        <span>
          <ExternalLink style={{ ...linkStyle }} href={linkUrl(infoUri)}>
            {prettyUrl(infoUri)}
          </ExternalLink>
        </span>
      )}
      {twitter && (
        <Space direction="horizontal">
          <ExternalLink
            style={{
              ...linkStyle,
            }}
            href={'https://twitter.com/' + twitter}
          >
            <span style={{ marginRight: 4 }}>
              <TwitterOutlined />
            </span>
            @{prettyUrl(twitter)}
          </ExternalLink>
          {twitterVerifyEnabled && <TwitterVerified />}
        </Space>
      )}
      {discord && (
        <ExternalLink
          style={{
            ...linkStyle,
          }}
          href={linkUrl(discord)}
        >
          <span style={{ marginRight: 4 }}>
            <Discord size={11} />
          </span>
          Discord
        </ExternalLink>
      )}
    </Space>
  )
}
