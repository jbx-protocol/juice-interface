import { Tooltip } from 'antd'

import { t } from '@lingui/macro'

import { NetworkName } from 'models/network-name'

import { LinkOutlined } from '@ant-design/icons'

import { readNetwork } from 'constants/networks'

export default function EtherscanLink({
  value,
  type,
  showText,
}: {
  value: string | undefined
  type: 'tx' | 'address'
  showText?: boolean
}) {
  if (!value) return null

  let subdomain = ''

  if (readNetwork.name !== NetworkName.mainnet) {
    subdomain = readNetwork.name + '.'
  }

  const goToEtherscan = () => {
    window.open(`https://${subdomain}etherscan.io/${type}/${value}`)
  }

  if (type === 'tx') {
    return (
      <Tooltip trigger={['hover', 'click']} title={t`See transaction`}>
        <a
          className="hover-action"
          style={{ fontWeight: 400 }}
          onClick={goToEtherscan}
          href={`https://${subdomain}etherscan.io/${type}/${value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkOutlined />
        </a>
      </Tooltip>
    )
  }
  return (
    <Tooltip trigger={['hover', 'click']} title={t`Go to Etherscan`}>
      <a
        className="hover-action"
        style={{ fontWeight: 400 }}
        onClick={goToEtherscan}
        href={`https://${subdomain}etherscan.io/${type}/${value}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {value}
      </a>
    </Tooltip>
  )
}
