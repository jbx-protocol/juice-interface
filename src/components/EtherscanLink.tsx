import { LinkOutlined } from '@ant-design/icons'
import { CSSProperties, PropsWithChildren } from 'react'
import { truncateEthAddress } from 'utils/format/formatAddress'

import { etherscanLink } from 'utils/etherscan'
import ExternalLink from './ExternalLink'

export default function EtherscanLink({
  value,
  type,
  truncated,
  truncateTo,
  style,
  children,
}: PropsWithChildren<{
  value: string | undefined
  type: 'tx' | 'address'
  truncated?: boolean
  truncateTo?: number
  style?: CSSProperties
}>) {
  if (!value) return null
  let truncatedValue: string | undefined
  // Return first and last 4 chars of ETH address only
  if (truncated) {
    truncatedValue = truncateEthAddress({ address: value, truncateTo })
  }

  const linkProps = {
    className:
      'hover-text-action-primary hover-text-decoration-underline color-unset',
    style: { ...style },
    href: etherscanLink(type, value),
  }

  if (type === 'tx') {
    return (
      <ExternalLink {...linkProps}>
        <LinkOutlined />
      </ExternalLink>
    )
  }

  return (
    <ExternalLink {...linkProps}>
      {children ?? truncatedValue ?? value}
    </ExternalLink>
  )
}
