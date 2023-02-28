import { Tooltip } from 'antd'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { useEnsName } from 'hooks/ensName'
import { MouseEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { truncateEthAddress } from 'utils/format/formatAddress'

export default function FormattedAddress({
  className,
  address,
  title,
  label,
  tooltipDisabled,
  truncateTo,
  onClick,
  withEnsAvatar,
}: {
  className?: string
  address: string | undefined
  title?: string
  label?: string
  tooltipDisabled?: boolean
  truncateTo?: number
  onClick?: MouseEventHandler
  withEnsAvatar?: boolean
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
          {title ? <div className="text-xs font-bold">{title}</div> : null}
          {address} <CopyTextButton value={address} />
        </span>
      }
    >
      <span className="flex items-center">
        {withEnsAvatar && (
          <img
            src={ensAvatarUrlForAddress(address, { size: 20 })}
            className="mr-2 h-5 w-5 rounded-full"
          />
        )}
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
