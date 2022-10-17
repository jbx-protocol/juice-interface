import { MenuOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Collapse, Menu } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Header } from 'antd/lib/layout/layout'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import Account from '../Account'
import { resourcesMenuItems } from '../constants'
import Logo from '../Logo'
import NavLanguageSelector from '../NavLanguageSelector'
import { navMenuItemStyles, topNavStyles } from '../navStyles'
import { TransactionsList } from '../TransactionList'
import ThemePickerMobile from './ThemePickerMobile'

const NAV_EXPANDED_KEY = 0

export default function MobileCollapse() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const isMobile = useMobile()
  const { isConnected, disconnect } = useWallet()

  const isNavExpanded = activeKey === NAV_EXPANDED_KEY

  const collapseNav = () => setActiveKey(undefined)
  const expandNav = () => setActiveKey(NAV_EXPANDED_KEY)
  const toggleNav = () => (isNavExpanded ? collapseNav() : expandNav())

  const menuItemProps = {
    onClick: () => collapseNav,
    style: navMenuItemStyles,
    className: 'nav-menu-item hover-opacity',
  }

  const externalMenuLinkProps = {
    ...menuItemProps,
    target: '_blank',
    rel: 'noopener noreferrer',
  }

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
          <Menu
            mode="inline"
            items={[
              {
                key: 'projects',
                label: (
                  <Link href="/projects">
                    <a {...menuItemProps}>{t`Projects`}</a>
                  </Link>
                ),
              },
              {
                key: 'docs',
                label: (
                  <Link href="https://info.juicebox.money/">
                    <a {...externalMenuLinkProps}>{t`Docs`}</a>
                  </Link>
                ),
              },
              {
                key: 'blog',
                label: (
                  <Link href="https://info.juicebox.money/blog">
                    <a {...externalMenuLinkProps}>{t`Blog`}</a>
                  </Link>
                ),
              },
              {
                key: 'resources',
                label: (
                  <Link href="">
                    <a
                      className="nav-menu-item hover-opacity"
                      style={{ ...navMenuItemStyles }}
                    >
                      {t`Resources`}
                    </a>
                  </Link>
                ),
                children: [...resourcesMenuItems(true)],
              },
              { key: 'language-picker', label: <NavLanguageSelector /> },
              { key: 'theme-picker', label: <ThemePickerMobile /> },
              {
                key: 'account',
                label: <Account />,
              },
              {
                key: 'disconnect',
                label: isConnected ? (
                  <Button onClick={disconnect} style={{ marginTop: 10 }} block>
                    <Trans>Disconnect</Trans>
                  </Button>
                ) : null,
              },
            ]}
            defaultSelectedKeys={['resources']}
          />
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
