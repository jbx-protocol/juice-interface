import { Tooltip } from 'antd'

import { t } from '@lingui/macro'

import { NetworkName } from 'models/network-name'

import { LinkOutlined } from '@ant-design/icons'

import { readNetwork } from 'constants/networks'
import ExternalLink from './ExternalLink'

export default function EtherscanLink({
  value,
  type,
}: {
  value: string | undefined
  type: 'tx' | 'address'
}) {
  if (!value) return null

  let subdomain = ''
  if (readNetwork.name !== NetworkName.mainnet) {
    subdomain = readNetwork.name + '.'
  }

  const linkProps = {
    className: 'hover-action',
    style: { fontWeight: 400 },
    href: `https://${subdomain}etherscan.io/${type}/${value}`,
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
      <ExternalLink {...linkProps}>{value}</ExternalLink>
    </Tooltip>
  )
}
