import {
  CrownOutlined,
  DollarCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Dropdown } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import CopyTextButton from 'components/buttons/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import ExternalLink from 'components/ExternalLink'
import FormattedAddress from 'components/FormattedAddress'
import { useQwestiveSDK } from 'contexts/QwestiveReferral/QwestiveReferral'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { useEffect } from 'react'
import Balance from './Balance'

export default function WalletMenu({ userAddress }: { userAddress: string }) {
  const isMobile = useMobile()
  const { disconnect } = useWallet()

  /**
   * Qwestive tracker SDK and embedUI SDK registering current user's wallet
   * address
   */
  const { qwestiveTracker } = useQwestiveSDK()

  useEffect(() => {
    if (!userAddress || qwestiveTracker.isLoading) return
    // Send user address to track user
    qwestiveTracker?.setAlias?.({ id: userAddress })
  }, [userAddress, qwestiveTracker])

  const CopyableAddress = () => (
    <div className="text-black dark:text-slate-100">
      <EtherscanLink value={userAddress} type="address" truncated />{' '}
      <CopyTextButton value={userAddress} className="z-10" />
    </div>
  )

  const MyProjects = () => (
    <>
      <Link href={`/account/${userAddress}`}>
        <a className="font-base text-black dark:text-slate-100">
          <Trans>My account</Trans>
        </a>
      </Link>
      <CrownOutlined className="text-black dark:text-slate-100" />
    </>
  )

  const Disconnect = () => (
    <>
      <span className="text-black dark:text-slate-100">
        <Trans>Disconnect</Trans>
      </span>
      <LogoutOutlined className="text-black dark:text-slate-100" rotate={-90} />
    </>
  )

  const Referral = () => (
    <>
      <ExternalLink
        className="text-black dark:text-slate-100"
        href="https://juicebox.referral.qwestive.io/referral/hJCUZVJIodVP6Ki6MP6e"
      >
        Referral
      </ExternalLink>
      <DollarCircleOutlined className="text-black dark:text-slate-100" />
    </>
  )

  const items: ItemType[] = [
    {
      key: 0,
      label: <CopyableAddress />,
    },
    {
      key: 1,
      label: <MyProjects />,
    },
    {
      key: 2,
      label: <Referral />,
    },
  ]

  if (!isMobile) {
    items.push({
      key: 3,
      label: <Disconnect />,
      onClick: async () => {
        await disconnect()
      },
    })
  }

  return (
    <Dropdown
      menu={{ items }}
      placement={!isMobile ? 'bottomRight' : 'top'}
      overlayClassName="p-0"
    >
      <div className="flex h-11 w-full cursor-default select-all flex-col items-center rounded-lg bg-smoke-75 px-5 pt-1 pb-2 dark:bg-slate-400">
        <FormattedAddress
          address={userAddress}
          tooltipDisabled
          className="font-normal"
        />
        <Balance address={userAddress} hideTooltip />
      </div>
    </Dropdown>
  )
}
