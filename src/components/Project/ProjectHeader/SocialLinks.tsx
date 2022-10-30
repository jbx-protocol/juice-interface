import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import Link from 'next/link'
import { CSSProperties } from 'react'

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
  return (
    <Space
      size="middle"
      style={{ flexWrap: 'wrap', columnGap: '1.5rem', rowGap: '0.5rem' }}
    >
      {infoUri && <GlobalOutlined />}
      {twitter && <TwitterOutlined />}
      {discord && <Discord />}
    </Space>
  )
}
