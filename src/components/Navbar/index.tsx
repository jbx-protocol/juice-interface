import { Space } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import useMobile from 'hooks/Mobile'

import MobileCollapse from './Mobile/MobileCollapse'
import { TopLeftNavItems } from './MenuItems'
import NavLanguageSelector from './NavLanguageSelector'
import ThemePicker from './ThemePicker'
import { topNavStyles, topRightNavStyles } from './navStyles'
import Account from './Account'

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
