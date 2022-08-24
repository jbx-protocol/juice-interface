import { CrownOutlined, LogoutOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Dropdown, Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import CopyTextButton from 'components/CopyTextButton'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { useContext } from 'react'
import Balance from './Balance'

export default function Wallet({ userAddress }: { userAddress: string }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const isMobile = useMobile()

  const height = 45

  const { disconnect } = useWallet()

  const CopyableAddress = () => (
    <>
      <EtherscanLink value={userAddress} type="address" truncated />{' '}
      <CopyTextButton value={userAddress} style={{ zIndex: 1 }} />
    </>
  )

  const MyProjects = () => (
    <>
      <Link href="/projects?tab=myprojects">
        <a style={{ fontWeight: 400 }}>
          <Trans>My projects</Trans>
        </a>
      </Link>
      <CrownOutlined />
    </>
  )

  const Disconnect = () => (
    <>
      <Trans>Disconnect</Trans>
      <LogoutOutlined rotate={-90} />
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
  ]
  if (!isMobile) {
    items.push({
      key: 2,
      label: <Disconnect />,
      onClick: async () => {
        await disconnect()
      },
    })
  }

  return (
    <Dropdown
      overlay={<Menu items={items} />}
      placement={!isMobile ? 'bottomRight' : 'top'}
      overlayStyle={{ padding: 0 }}
    >
      <div
        style={{
          height,
          borderRadius: 2,
          padding: '4px 19px 7px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: colors.background.l2,
          cursor: 'default',
          userSelect: 'all',
          width: '100%',
        }}
      >
        <FormattedAddress address={userAddress} tooltipDisabled={true} />
        <Balance address={userAddress} hideTooltip />
      </div>
    </Dropdown>
  )
}
