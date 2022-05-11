import { Tooltip } from 'antd'
import { t } from '@lingui/macro'
import { NetworkName } from 'models/network-name'
import { LinkOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

import { readNetwork } from 'constants/networks'
import ExternalLink from './ExternalLink'

export default function EtherscanLink({
  value,
  type,
  truncated,
  style,
  timestamp,
}: {
  value: string | undefined
  type: 'tx' | 'address'
  truncated?: boolean
  style?: CSSProperties
  timestamp?: number
}) {
  if (!value) return null
  let truncatedValue: string | undefined
  // Return first and last 4 chars of ETH address only
  if (truncated) {
    truncatedValue =
      value.substring(0, 6) + '...' + value.substring(value.length - 4)
  }

  let subdomain = ''
  if (readNetwork.name !== NetworkName.mainnet) {
    subdomain = readNetwork.name + '.'
  }
  const linkProps = {
    className: 'hover-action',
    style: { ...style, fontWeight: 400 },
    href: `https://${subdomain}etherscan.io/${type}/${value}`,
  }

  if (timestamp) {
    return (
      <Tooltip title={t`Go to Etherscan`}>
        <ExternalLink {...linkProps}>
          {formatHistoricalDate(timestamp * 1000)}
        </ExternalLink>
      </Tooltip>
    )
  }

  if (type === 'tx') {
    return (
      <Tooltip title={t`See transaction`}>
        <ExternalLink {...linkProps}>
          <LinkOutlined />
        </ExternalLink>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={t`Go to Etherscan`}>
      <ExternalLink {...linkProps}>{truncatedValue ?? value}</ExternalLink>
    </Tooltip>
  )
}
