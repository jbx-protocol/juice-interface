import { MenuOutlined } from '@ant-design/icons'
import { Collapse, Menu } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Header } from 'antd/lib/layout/layout'
import { ThemeContext } from 'contexts/themeContext'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { mobileNavItems } from '../constants'
import Logo from '../Logo'
import { topNavStyles } from '../navStyles'
import { TransactionsList } from '../TransactionList'

const NAV_EXPANDED_KEY = 0

export default function MobileNavigation() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const { isConnected, disconnect } = useWallet()

  const isNavExpanded = activeKey === NAV_EXPANDED_KEY

  const collapseNav = () => setActiveKey(undefined)
  const expandNav = () => setActiveKey(NAV_EXPANDED_KEY)
  const toggleNav = () => (isNavExpanded ? collapseNav() : expandNav())

  // Close collapse when clicking anywhere in the window except the collapse items
  useEffect(() => {
    function handleClick() {
      setActiveKey(undefined)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <Header
      className="top-nav top-nav-mobile"
      onClick={e => {
        e.stopPropagation()
      }}
      style={{
        ...topNavStyles,
        padding: '16px 8px',
        width: '100%',
        position: 'fixed',
      }}
    >
      <Collapse style={{ border: 'none' }} activeKey={activeKey}>
        <CollapsePanel
          style={{ border: 'none' }}
          key={0}
          showArrow={false}
          header={
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Link href="/">
                <a style={{ display: 'inline-block' }}>
                  {<Logo height={30} />}
                </a>
              </Link>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 30,
                }}
              >
                <TransactionsList
                  listStyle={{
                    position: 'absolute',
                    top: 48,
                    left: 0,
                    right: 0,
                    padding: 12,
                  }}
                />
                <MenuOutlined
                  style={{
                    color: colors.icon.primary,
                    fontSize: '1.5rem',
                  }}
                  onClick={toggleNav}
                  role="button"
                />
              </div>
            </div>
          }
        >
          <Menu
            mode="inline"
            items={mobileNavItems({ isConnected, disconnect, collapseNav })}
            defaultSelectedKeys={['resources']}
          />
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
