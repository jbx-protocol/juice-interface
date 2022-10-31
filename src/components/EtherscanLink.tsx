import { LinkOutlined } from '@ant-design/icons'
import { CSSProperties, MouseEventHandler } from 'react'
import { truncateEthAddress } from 'utils/format/formatAddress'

import { etherscanLink } from 'utils/etherscan'
import ExternalLink from './ExternalLink'

const EtherscanLink: React.FC<{
  value: string | undefined
  type: 'tx' | 'address'
  truncated?: boolean
  truncateTo?: number
  style?: CSSProperties
  onClick?: MouseEventHandler
}> = ({ value, type, truncated, truncateTo, style, children, onClick }) => {
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
      <ExternalLink onClick={onClick} {...linkProps}>
        {children} <LinkOutlined />
      </ExternalLink>
    )
  }

  return (
    <ExternalLink onClick={onClick} {...linkProps}>
      {children ?? truncatedValue ?? value}
    </ExternalLink>
  )
}

export default EtherscanLink
