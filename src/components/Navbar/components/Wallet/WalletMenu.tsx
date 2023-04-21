import {
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import { useWallet } from 'hooks/Wallet'
import { ReactNode, useCallback, useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu'

const WalletItemContainer = ({
  icon,
  label,
}: {
  icon: ReactNode
  label: ReactNode
}) => (
  <div className="flex items-center gap-2">
    <span className="h-5 w-5">{icon}</span>
    <span>{label}</span>
  </div>
)

export default function WalletMenu({ userAddress }: { userAddress: string }) {
  const { disconnect } = useWallet()
  const [copied, setCopied] = useState<boolean>(false)

  const onCopyAddressClicked = useCallback(() => {
    navigator.clipboard.writeText(userAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }, [userAddress])

  const items: DropdownMenuItem[] = [
    {
      id: 'copyable-address',
      label: (
        <WalletItemContainer
          icon={<ClipboardDocumentIcon />}
          label={
            copied ? (
              t`Copied!`
            ) : (
              <FormattedAddress
                tooltipDisabled
                linkDisabled
                address={userAddress}
                truncateTo={4}
              />
            )
          }
        />
      ),
      onClick: stopPropagation(onCopyAddressClicked),
    },
    {
      id: 'my-account',
      label: <WalletItemContainer icon={<UserIcon />} label={t`My account`} />,
      href: `/account/${userAddress}`,
    },
    {
      id: 'referral',
      label: (
        <WalletItemContainer
          icon={<CurrencyDollarIcon />}
          label={t`Referral`}
        />
      ),
      href: 'https://juicebox.referral.qwestive.io/referral/hJCUZVJIodVP6Ki6MP6e',
      isExternal: true,
    },
    {
      id: 'disconnect',
      label: (
        <WalletItemContainer
          icon={<ArrowRightOnRectangleIcon />}
          label={t`Disconnect`}
        />
      ),
      onClick: async () => await disconnect(),
    },
  ]

  return (
    <DropdownMenu
      hideArrow
      heading={
        <div className="flex w-full cursor-pointer select-none items-center justify-center rounded-lg bg-bluebs-50 px-4 py-2.5 dark:bg-slate-400">
          <FormattedAddress
            address={userAddress}
            tooltipDisabled
            className="text-sm font-medium text-bluebs-700 dark:text-bluebs-300"
          />
        </div>
      }
      items={items}
    />
  )
}
