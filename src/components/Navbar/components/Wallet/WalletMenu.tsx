import {
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
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
              <EthereumAddress
                tooltipDisabled
                linkDisabled
                ensDisabled
                truncateTo={4}
                address={userAddress}
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
        <div className="flex w-full cursor-pointer select-none items-center justify-center rounded-lg bg-bluebs-50 px-4 py-2.5 dark:bg-bluebs-900">
          <EthereumAddress
            address={userAddress}
            tooltipDisabled
            linkDisabled
            className="select-none text-sm font-medium text-bluebs-700 dark:text-bluebs-100"
          />
        </div>
      }
      dropdownClassName="md:w-44"
      items={items}
    />
  )
}
