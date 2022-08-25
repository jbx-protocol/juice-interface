import { LinkOutlined } from '@ant-design/icons'
import { NetworkName } from 'models/network-name'
import { CSSProperties } from 'react'
import { truncateEthAddress } from 'utils/formatAddress'

import { readNetwork } from 'constants/networks'
import ExternalLink from './ExternalLink'

export default function EtherscanLink({
  value,
  type,
  truncated,
  truncateTo,
  style,
  className,
}: {
  value: string | undefined
  type: 'tx' | 'address'
  truncated?: boolean
  truncateTo?: number
  style?: CSSProperties
  className?: string
}) {
  if (!value) return null
  let truncatedValue: string | undefined
  // Return first and last 4 chars of ETH address only
  if (truncated) {
    truncatedValue = truncateEthAddress({ address: value, truncateTo })
  }

  let subdomain = ''
  if (readNetwork.name !== NetworkName.mainnet) {
    subdomain = readNetwork.name + '.'
  }
  const linkProps = {
    className: 'hover-action' + className,
    style: { ...style, fontWeight: 400 },
    href: `https://${subdomain}etherscan.io/${type}/${value}`,
  }

  if (type === 'tx') {
    return (
      <ExternalLink {...linkProps}>
        <LinkOutlined />
      </ExternalLink>
    )
  }

  return <ExternalLink {...linkProps}>{truncatedValue ?? value}</ExternalLink>
}
