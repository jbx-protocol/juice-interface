import { useState, useContext } from 'react'
import { Collapse, Space } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

import { Trans } from '@lingui/macro'

import { MoreOutlined, LogoutOutlined } from '@ant-design/icons'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'

import ThemePicker from './ThemePicker'
import LanguageSelector from './NavLanguageSelector'

export default function OptionsCollapse() {
  const [activeKey, setActiveKey] = useState<0 | undefined>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { signingProvider, onLogOut } = useContext(NetworkContext)

  // Close collapse when clicking anywhere in the window except the collapse items
  window.addEventListener('click', () => setActiveKey(undefined), false)

  return (
    <div className="top-nav-options">
      <Collapse style={{ border: 'none' }} activeKey={activeKey}>
        <CollapsePanel
          style={{
            border: 'none',
          }}
          key={0}
          showArrow={false}
          header={
            <Space
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              <MoreOutlined
                style={{
                  fontSize: '1.5em',
                  color: colors.icon.primary,
                }}
              />
            </Space>
          }
        >
          {/* Do not close collapse when clicking its items (except on wallet disconnect)*/}
          <div onClick={e => e.stopPropagation()}>
            <div className="nav-dropdown-item">
              <ThemePicker />
            </div>
            <div className="nav-dropdown-item">
              <LanguageSelector />
            </div>
            {signingProvider ? (
              <div
                className="nav-dropdown-item"
                onClick={() => setActiveKey(undefined)}
              >
                <LogoutOutlined />
                <div onClick={onLogOut}>
                  <div style={{ margin: '0 0 2px 13px' }}>
                    <Trans>Disconnect</Trans>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
