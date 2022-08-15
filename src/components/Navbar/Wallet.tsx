import FormattedAddress from 'components/FormattedAddress'
import { LogoutOutlined, CrownOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { Dropdown, Menu } from 'antd'

import EtherscanLink from 'components/EtherscanLink'
import CopyTextButton from 'components/CopyTextButton'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'

import Balance from './Balance'

export default function Wallet({ userAddress }: { userAddress: string }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const isMobile = useMobile()

  const height = 45

  const { disconnect } = useWallet()

  const menuItemPadding = '10px 15px'

  const menu = (
    <Menu>
      <Menu.Item style={{ padding: menuItemPadding }} key={0}>
        <EtherscanLink value={userAddress} type="address" truncated={true} />{' '}
        <CopyTextButton value={userAddress} style={{ zIndex: 1 }} />
      </Menu.Item>
      <Menu.Item
        style={{
          padding: menuItemPadding,
          color: colors.text.primary,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/projects?tab=myprojects">
          <a>
            <Trans>My projects</Trans>
          </a>
        </Link>
        <CrownOutlined />
      </Menu.Item>
      {!isMobile && (
        <Menu.Item
          onClick={() => disconnect()}
          style={{
            padding: menuItemPadding,
            color: colors.text.primary,
            display: 'flex',
            justifyContent: 'space-between',
          }}
          key={1}
        >
          <Trans>Disconnect</Trans>
          <LogoutOutlined />
        </Menu.Item>
      )}
    </Menu>
  )

  return (
    <Dropdown
      overlay={menu}
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
        <Balance address={userAddress} />
      </div>
    </Dropdown>
  )
}
