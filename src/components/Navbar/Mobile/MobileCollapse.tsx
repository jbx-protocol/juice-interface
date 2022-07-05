import { useState, useContext, useEffect } from 'react'
import { Collapse, Space, Button, Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'

import { Trans } from '@lingui/macro'

import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

import { MenuOutlined } from '@ant-design/icons'

import { ThemeContext } from 'contexts/themeContext'
import { NetworkContext } from 'contexts/networkContext'

import FeedbackFormButton from 'components/FeedbackFormButton'

import Logo from '../Logo'
import Account from '../Account'
import NavLanguageSelector from '../NavLanguageSelector'
import { TopLeftNavItems } from '../MenuItems'
import ThemePickerMobile from './ThemePickerMobile'
import { topNavStyles } from '../navStyles'
import ResourcesDropdownMobile from './ResourcesDropdownMobile'

export default function MobileCollapse() {
  const [activeKey, setActiveKey] = useState<0 | undefined>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { signingProvider, onLogOut } = useContext(NetworkContext)

  const isNavOpen = activeKey === 0

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
            <Space
              onClick={e => {
                setActiveKey(isNavOpen ? undefined : 0)
                e.stopPropagation()
              }}
            >
              <a href="/" style={{ display: 'inline-block' }}>
                {<Logo height={30} />}
              </a>
              <MenuOutlined
                style={{
                  color: colors.icon.primary,
                  fontSize: 20,
                  paddingTop: 6,
                  paddingLeft: 10,
                }}
              />
            </Space>
          }
        >
          <Menu mode="inline" defaultSelectedKeys={['resources']}>
            <TopLeftNavItems
              mobile
              onClickMenuItems={() => setActiveKey(isNavOpen ? undefined : 0)}
            />

            <ResourcesDropdownMobile />

            <div style={{ marginLeft: 15 }}>
              <Menu.Item key="language-selector">
                <NavLanguageSelector mobile />
              </Menu.Item>
              <Menu.Item key="theme-picker">
                <ThemePickerMobile />
              </Menu.Item>
              <Menu.Item key="feedback">
                <FeedbackFormButton mobile />
              </Menu.Item>
            </div>
          </Menu>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Account />
            {signingProvider ? (
              <Button onClick={onLogOut} style={{ marginTop: 10 }}>
                <Trans>Disconnect</Trans>
              </Button>
            ) : null}
          </div>
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
