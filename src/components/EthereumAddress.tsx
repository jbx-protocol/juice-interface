import { Tooltip } from 'antd'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { useEnsName } from 'hooks/useEnsName'
import Link from 'next/link'
import { MouseEventHandler, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { truncateEthAddress } from 'utils/format/formatAddress'

export interface EthereumAddressProps {
  className?: string
  avatarClassName?: string
  address: string | undefined
  label?: string
  tooltipDisabled?: boolean
  linkDisabled?: boolean
  ensDisabled?: boolean
  onClick?: MouseEventHandler
  withEnsAvatar?: boolean
  href?: string
  truncateTo?: number
  showEnsLoading?: boolean
}

export default function EthereumAddress({
  className,
  avatarClassName,
  address,
  label,
  href,
  onClick,
  tooltipDisabled = false,
  linkDisabled = false,
  ensDisabled = false,
  withEnsAvatar = false,
  truncateTo,
  showEnsLoading = false,
}: EthereumAddressProps) {
  const { data: ensName, isLoading } = useEnsName(address, {
    enabled: !ensDisabled,
  })

  const formattedAddress = useMemo(() => {
    if (label) return label
    if (!ensDisabled && ensName) return ensName
    if (!address) return null

    return truncateEthAddress({ address, truncateTo })
  }, [address, ensName, label, ensDisabled, truncateTo])

  if (!formattedAddress) return null

  return (
    <Tooltip
      title={
        <span>
          {address} <CopyTextButton value={address} />
        </span>
      }
      open={tooltipDisabled ? false : undefined}
    >
      <span
        className={twMerge(
          'inline-flex items-center font-medium',
          showEnsLoading && isLoading ? 'animate-pulse' : null,
        )}
      >
        {withEnsAvatar && address && (
          <img
            src={ensAvatarUrlForAddress(address, { size: 72 })}
            className={twMerge('mr-2 h-9 w-9 rounded-full', avatarClassName)}
            alt={`Avatar for ${ensName ?? address}`}
            loading="lazy"
          />
        )}
        {linkDisabled ? (
          <span className={twMerge('select-all leading-[22px]', className)}>
            {formattedAddress}
          </span>
        ) : href ? (
          <Link
            href={href}
            className={twMerge(
              'select-all leading-[22px] text-current hover:text-bluebs-500 hover:underline',
              className,
            )}
          >
            {formattedAddress}
          </Link>
        ) : (
          <EtherscanLink
            className={twMerge('select-all leading-[22px]', className)}
            onClick={onClick}
            type="address"
            value={address}
          >
            {formattedAddress}
          </EtherscanLink>
        )}
      </span>
    </Tooltip>
  )
}
