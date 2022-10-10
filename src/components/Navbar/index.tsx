import { Space } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { TransactionsList } from 'components/Navbar/TransactionList'
import useMobile from 'hooks/Mobile'
import Account from './Account'
import { TopLeftNavItems } from './MenuItems'
import MobileCollapse from './Mobile/MobileCollapse'
import NavLanguageSelector from './NavLanguageSelector'
import { topNavStyles, topRightNavStyles } from './navStyles'
import ThemePicker from './ThemePicker'

export default function Navbar() {
  const isMobile = useMobile()

  if (isMobile) return <MobileCollapse />

  return (
    <Header className="top-nav" style={{ ...topNavStyles }}>
      <TopLeftNavItems />

      <Space size="middle" style={{ ...topRightNavStyles }}>
        <NavLanguageSelector />
        <ThemePicker />
        <TransactionsList
          listStyle={{
            position: 'absolute', // Position below navbar
            top: 70,
            right: 30,
          }}
        />
        <Account />
      </Space>
    </Header>
  )
}
