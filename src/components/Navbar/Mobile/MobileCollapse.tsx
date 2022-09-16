import { Trans } from '@lingui/macro'
import { Button, Collapse, Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'

import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

import { MenuOutlined } from '@ant-design/icons'

import { ThemeContext } from 'contexts/themeContext'
import { useWallet } from 'hooks/Wallet'

import useMobile from 'hooks/Mobile'
import Account from '../Account'
import Logo from '../Logo'
import { TopLeftNavItems } from '../MenuItems'
import NavLanguageSelector from '../NavLanguageSelector'
import { topNavStyles } from '../navStyles'
import TransactionsList from '../TransactionsList'
import ResourcesDropdownMobile from './ResourcesDropdownMobile'
import ThemePickerMobile from './ThemePickerMobile'

const NAV_EXPANDED_KEY = 0

export default function MobileCollapse() {
  const { isConnected, disconnect } = useWallet()
  const [activeKey, setActiveKey] = useState<0 | undefined>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const isMobile = useMobile()

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
                  listStyle={
                    isMobile
                      ? {
                          position: 'absolute',
                          top: 48,
                          left: 0,
                          right: 0,
                          padding: 12,
                        }
                      : {
                          position: 'absolute',
                          top: 70, // Position below navbar
                          right: 30,
                          width: 300,
                        }
                  }
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
          <Menu mode="inline" defaultSelectedKeys={['resources']}>
            <TopLeftNavItems mobile onClickMenuItems={() => collapseNav()} />

            <ResourcesDropdownMobile />

            <div style={{ marginLeft: 15 }}>
              <Menu.Item key="language-selector">
                <NavLanguageSelector mobile />
              </Menu.Item>
              <Menu.Item key="theme-picker">
                <ThemePickerMobile />
              </Menu.Item>
            </div>
          </Menu>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '1rem',
            }}
          >
            <Account />
            {isConnected ? (
              <Button onClick={disconnect} style={{ marginTop: 10 }} block>
                <Trans>Disconnect</Trans>
              </Button>
            ) : null}
          </div>
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
