import { Space } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import useMobile from 'hooks/Mobile'

import Account from './Account'
import { TopLeftNavItems } from './MenuItems'
import MobileCollapse from './Mobile/MobileCollapse'
import NavLanguageSelector from './NavLanguageSelector'
import { topNavStyles, topRightNavStyles } from './navStyles'
import ThemePicker from './ThemePicker'

export default function Navbar() {
  const isMobile = useMobile()
  return !isMobile ? (
    <Header className="top-nav" style={{ ...topNavStyles }}>
      <TopLeftNavItems />

      <Space size="middle" style={{ ...topRightNavStyles }}>
        <NavLanguageSelector />
        <ThemePicker />
        <Account />
      </Space>
    </Header>
  ) : (
    <MobileCollapse />
  )
}
