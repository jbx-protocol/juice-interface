import { Tooltip } from 'antd'
import { t } from '@lingui/macro'
import { NetworkName } from 'models/network-name'
import { LinkOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'
import { truncateEthAddress } from 'utils/formatAddress'

import { readNetwork } from 'constants/networks'
import ExternalLink from './ExternalLink'

export default function EtherscanLink({
  value,
  type,
  truncated,
  truncateTo,
  hideTooltip,
  style,
}: {
  value: string | undefined
  type: 'tx' | 'address'
  truncated?: boolean
  truncateTo?: number
  hideTooltip?: boolean
  style?: CSSProperties
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
    className: 'hover-action',
    style: { ...style, fontWeight: 400 },
    href: `https://${subdomain}etherscan.io/${type}/${value}`,
  }

  if (type === 'tx') {
    return (
      <Tooltip
        title={t`See transaction`}
        visible={hideTooltip ? !hideTooltip : undefined}
      >
        <ExternalLink {...linkProps}>
          <LinkOutlined />
        </ExternalLink>
      </Tooltip>
    )
  }

  return (
    <Tooltip
      title={t`Go to Etherscan`}
      visible={hideTooltip ? !hideTooltip : undefined}
    >
      <ExternalLink {...linkProps}>{truncatedValue ?? value}</ExternalLink>
    </Tooltip>
  )
}
