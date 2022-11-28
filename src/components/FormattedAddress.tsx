import { Tooltip } from 'antd'
import { CSSProperties, MouseEventHandler } from 'react'
import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { truncateEthAddress } from 'utils/format/formatAddress'
import { useEnsName } from 'hooks/ensName'

export default function FormattedAddress({
  address,
  label,
  tooltipDisabled,
  truncateTo,
  style,
  onClick,
}: {
  address: string | undefined
  label?: string
  tooltipDisabled?: boolean
  truncateTo?: number
  style?: CSSProperties
  onClick?: MouseEventHandler
}) {
  const ensName = useEnsName(address)

  if (!address) return null

  const formatted =
    ensName ?? label ?? truncateEthAddress({ address, truncateTo })

  const mergedStyle: CSSProperties = {
    userSelect: 'all',
    lineHeight: '22px',
    ...style,
  }

  if (tooltipDisabled) {
    return (
      <span onClick={onClick} style={mergedStyle}>
        {formatted}
      </span>
    )
  }

  return (
    <Tooltip
      title={
        <span style={{ fontSize: '0.875rem' }}>
          {address} <CopyTextButton value={address} />
        </span>
      }
    >
      <span>
        <EtherscanLink
          onClick={onClick}
          type="address"
          value={address}
          style={mergedStyle}
        >
          {formatted}
        </EtherscanLink>
      </span>
    </Tooltip>
  )
}
