import { Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'

import Account from './Account'

export default function Navbar({
  userAddress,
  hasBudget,
  shouldUseNetwork,
  onConnectWallet,
}: {
  userAddress?: string
  hasBudget?: boolean
  shouldUseNetwork?: string
  onConnectWallet: VoidFunction
}) {
  const menuItem = (text: string, route: string) => {
    const external = route.startsWith('http')

    return (
      <a
        style={{ fontWeight: 600 }}
        href={route}
        {...(external
          ? {
              target: '_blank',
              rel: 'noreferrer',
            }
          : {})}
      >
        {text}
      </a>
    )
  }

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'white',
      }}
    >
      <Menu
        mode="horizontal"
        theme="light"
        style={{ display: 'inline-block', border: 'none' }}
      >
        <Menu.Item key="logo" style={{ marginLeft: 0 }}>
          <a href="/" style={{ display: 'inline-block' }}>
            <img
              style={{ height: 40 }}
              src="/assets/juice_logo-ol.png"
              alt="Juice logo"
            />
          </a>
        </Menu.Item>
        {hasBudget && userAddress ? (
          <Menu.Item key="budget">
            {menuItem('Dashboard', '/#/' + userAddress)}
          </Menu.Item>
        ) : null}
        {/* <Menu.Item key="fluid-dynamics">
          {menuItem(
            'Fluid dynamics',
            'https://www.figma.com/file/ZklsxqZUsjK3XO5BksCyE4/Juicy-Funstuff?node-id=0%3A1',
            )}
          </Menu.Item> */}
      </Menu>
      <div className="hide-mobile">
        <Account
          loadWeb3Modal={onConnectWallet}
          userAddress={userAddress}
          shouldUseNetwork={shouldUseNetwork}
        />
      </div>
    </Header>
  )
}
