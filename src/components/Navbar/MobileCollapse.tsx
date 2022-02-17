import { useState, useContext } from 'react'
import { Collapse, Space, Button } from 'antd'
import { Header } from 'antd/lib/layout/layout'

import { Trans } from '@lingui/macro'

import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

import { MenuOutlined } from '@ant-design/icons'

import { ThemeContext } from 'contexts/themeContext'
import { NetworkContext } from 'contexts/networkContext'

import FeedbackFormBtn from 'components/shared/FeedbackFormBtn'

import ThemePicker from './ThemePicker'
import Logo from './Logo'
import Account from './Account'
import NavLanguageSelector from './NavLanguageSelector'
import { menu } from './MenuItems'

export default function MobileCollapse() {
  const [activeKey, setActiveKey] = useState<0 | undefined>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { signingProvider, onLogOut } = useContext(NetworkContext)
  return (
    <Header
      className="top-nav top-nav-mobile"
      onClick={e => {
        e.stopPropagation()
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
                setActiveKey(activeKey === 0 ? undefined : 0)
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
          {menu(() => setActiveKey(activeKey === 0 ? undefined : 0))}
          <div className="nav-subsection">
            <NavLanguageSelector />
            <ThemePicker mobile={true} />
            <FeedbackFormBtn mobile={true} />
          </div>
          <Account mobile={true} />
          {signingProvider ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 10,
              }}
            >
              <Button onClick={onLogOut}>
                <Trans>Disconnect</Trans>
              </Button>
            </div>
          ) : null}
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
