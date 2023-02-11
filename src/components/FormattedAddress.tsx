import { Tooltip } from 'antd'
import { MouseEventHandler } from 'react'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { truncateEthAddress } from 'utils/format/formatAddress'
import { useEnsName } from 'hooks/ensName'
import { twMerge } from 'tailwind-merge'

export default function FormattedAddress({
  className,
  address,
  label,
  tooltipDisabled,
  truncateTo,
  onClick,
}: {
  className?: string
  address: string | undefined
  label?: string
  tooltipDisabled?: boolean
  truncateTo?: number
  onClick?: MouseEventHandler
}) {
  const ensName = useEnsName(address)

  if (!address) return null

  const formatted =
    ensName ?? label ?? truncateEthAddress({ address, truncateTo })

  if (tooltipDisabled) {
    return (
      <span
        className={twMerge('select-all leading-[22px]', className)}
        onClick={onClick}
      >
        {formatted}
      </span>
    )
  }

  return (
    <Tooltip
      title={
        <span className="text-sm">
          {address} <CopyTextButton value={address} />
        </span>
      }
    >
      <span>
        <EtherscanLink
          className={twMerge('select-all leading-[22px]', className)}
          onClick={onClick}
          type="address"
          value={address}
        >
          {formatted}
        </EtherscanLink>
      </span>
    </Tooltip>
  )
}
