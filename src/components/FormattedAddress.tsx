import { Tooltip } from 'antd'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { useEnsName } from 'hooks/ensName'
import { MouseEventHandler } from 'react'
import { twMerge } from 'tailwind-merge'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { truncateEthAddress } from 'utils/format/formatAddress'

interface FormattedAddressProps {
  className?: string
  address: string | undefined
  title?: string
  label?: string
  tooltipDisabled?: boolean
  linkDisabled?: boolean
  truncateTo?: number
  onClick?: MouseEventHandler
  withEnsAvatar?: boolean
}

export default function FormattedAddress({
  className,
  address,
  title,
  label,
  tooltipDisabled = false,
  linkDisabled = false,
  truncateTo,
  onClick,
  withEnsAvatar,
}: FormattedAddressProps) {
  const { data: ensName } = useEnsName(address)

  if (!address) return null

  const formatted =
    ensName ?? label ?? truncateEthAddress({ address, truncateTo })

  return (
    <Tooltip
      title={
        <span>
          {title ? <div>{title}</div> : null}
          {address} <CopyTextButton value={address} />
        </span>
      }
      open={tooltipDisabled ? false : undefined}
    >
      <span className="inline-flex items-center">
        {withEnsAvatar && ensName && (
          <img
            src={ensAvatarUrlForAddress(address, { size: 40 })}
            className="mr-1.5 h-5 w-5 rounded-full"
            alt={`Avatar for ${ensName}`}
            loading="lazy"
          />
        )}
        {linkDisabled ? (
          <span className={twMerge('select-all leading-[22px]', className)}>
            {formatted}
          </span>
        ) : (
          <EtherscanLink
            className={twMerge('select-all leading-[22px]', className)}
            onClick={onClick}
            type="address"
            value={address}
          >
            {formatted}
          </EtherscanLink>
        )}
      </span>
    </Tooltip>
  )
}
