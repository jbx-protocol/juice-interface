import { LinkOutlined } from '@ant-design/icons'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/network-name'

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
    <a
      className="quiet"
      href={`https://${subdomain}etherscan.io/${type}/${value}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <LinkOutlined />
    </a>
  )
}
