import { Space } from 'antd'
import { Header } from 'antd/lib/layout/layout'

import Account from './Account'
import MobileCollapse from './MobileCollapse'
import Logo from './Logo'
import OptionsCollapse from './OptionsCollapse'
import { menu } from './MenuItems'

export default function Navbar() {
  return window.innerWidth > 900 ? (
    <Header className="top-nav">
      <Space className="top-left-nav" size="large">
        <a href="/" style={{ display: 'inline-block' }}>
          {<Logo />}
        </a>
        {menu()}
      </Space>

      <Space className="top-right-nav" size="middle">
        <OptionsCollapse />
        <Account />
      </Space>
    </Header>
  ) : (
    <MobileCollapse />
  )
}
