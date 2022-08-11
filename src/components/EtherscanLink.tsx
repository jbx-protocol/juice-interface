import { Tooltip } from 'antd'
import { t } from '@lingui/macro'
import { LinkOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'
import { getEtherscanBaseUrl } from 'utils/etherscan'

import { readNetwork } from 'constants/networks'
import ExternalLink from './ExternalLink'

export default function EtherscanLink({
  value,
  type,
  truncated,
  style,
}: {
  value: string | undefined
  type: 'tx' | 'address'
  truncated?: boolean
  style?: CSSProperties
}) {
  if (!value) return null
  let truncatedValue: string | undefined
  // Return first and last 4 chars of ETH address only
  if (truncated) {
    truncatedValue =
      value.substring(0, 6) + '...' + value.substring(value.length - 4)
  }

  const etherscanBaseUrl = getEtherscanBaseUrl(readNetwork.name)

  const linkProps = {
    className: 'hover-action',
    style: { ...style, fontWeight: 400 },
    href: `${etherscanBaseUrl}/${type}/${value}`,
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
