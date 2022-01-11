import { LinkOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

import { NetworkName } from 'models/network-name'

import { readNetwork } from 'constants/networks'

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

  return (
    <Tooltip trigger={['hover', 'click']} title={'Go to Etherscan'}>
      <a
        className="quiet"
        href={`https://${subdomain}etherscan.io/${type}/${value}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkOutlined />
      </a>
    </Tooltip>
  )
}
