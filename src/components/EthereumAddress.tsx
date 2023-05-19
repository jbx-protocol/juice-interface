import { Tooltip } from 'antd'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import { useEnsName } from 'hooks/useEnsName'
import Link from 'next/link'
import { MouseEventHandler, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { ensAvatarUrlForAddress } from 'utils/ens'
import { truncateEthAddress } from 'utils/format/formatAddress'

interface EthereumAddressProps {
  className?: string
  address: string | undefined
  label?: string
  tooltipDisabled?: boolean
  linkDisabled?: boolean
  ensDisabled?: boolean
  onClick?: MouseEventHandler
  withEnsAvatar?: boolean
  href?: string
}

export default function EthereumAddress({
  className,
  address,
  label,
  href,
  onClick,
  tooltipDisabled = false,
  linkDisabled = false,
  ensDisabled = false,
  withEnsAvatar = false,
}: EthereumAddressProps) {
  const { data: ensName } = useEnsName(address, { enabled: !ensDisabled })

  const formattedAddress = useMemo(() => {
    if (label) return label
    if (!ensDisabled && ensName) return ensName
    if (!address) return null

    return truncateEthAddress({ address })
  }, [address, ensName, label, ensDisabled])

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
      <span className="inline-flex items-center">
        {withEnsAvatar && ensName && address && (
          <img
            src={ensAvatarUrlForAddress(address, { size: 40 })}
            className="mr-1.5 h-5 w-5 rounded-full"
            alt={`Avatar for ${ensName}`}
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
            truncated
          />
        )}
      </span>
    </Tooltip>
  )
}
