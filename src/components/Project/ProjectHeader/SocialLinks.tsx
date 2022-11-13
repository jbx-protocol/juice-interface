import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import { CSSProperties } from 'react'
import { linkUrl } from 'utils/url'

const linkStyle: CSSProperties = {
  maxWidth: '20rem',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  fontWeight: 500,
  whiteSpace: 'pre',
  display: 'block',
}

// <ExternalLink style={{ ...linkStyle }} href={linkUrl(infoUri)}>
//   {prettyUrl(infoUri)}
// </ExternalLink>s

function SocialButton({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 9,
        borderRadius: '50%',
        backgroundColor: '#E1E0E0',
        border: '1px solid #E0DBD2',
      }}
    >
      {children}
    </div>
  )
}

const iconStyle: CSSProperties = {
  color: '#AAA49A',
  fontSize: '20px',
  backgroundColor: '#E1E0E0',
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
  return (
    <Space style={{ flexWrap: 'wrap', columnGap: 6 }}>
      {infoUri && (
        <SocialButton>
          <GlobalOutlined style={iconStyle} />
        </SocialButton>
      )}
      {twitter && (
        <ExternalLink
          style={{
            ...linkStyle,
          }}
          href={'https://twitter.com/' + twitter}
        >
          <SocialButton>
            <TwitterOutlined style={iconStyle} />
          </SocialButton>
        </ExternalLink>
      )}
      {discord && (
        <ExternalLink
          style={{
            ...linkStyle,
          }}
          href={linkUrl(discord)}
        >
          <SocialButton>
            <Discord style={{ ...iconStyle, width: 20, height: 20 }} />
          </SocialButton>
        </ExternalLink>
      )}
    </Space>
  )
}
