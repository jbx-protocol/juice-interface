import { Menu, Space } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import useMobile from 'hooks/Mobile'
import { CSSProperties, useEffect, useState } from 'react'
import Account from './Account'
import { desktopMenuItems, resourcesMenuItems } from './constants'
import MobileNavigation from './Mobile/MobileNavigation'
import NavLanguageSelector from './NavLanguageSelector'
import { topNavStyles } from './navStyles'
import ThemePicker from './ThemePicker'
import { TransactionsList } from './TransactionList'

const resourcesMenu = (
  <Menu
    items={resourcesMenuItems()}
    style={{ marginTop: -16, marginLeft: -6 }}
  />
)

export default function SiteNavigation() {
  const [resourcesOpen, setResourcesOpen] = useState<boolean>(false)
  const isMobile = useMobile()
  const dropdownIconStyle: CSSProperties = {
    fontSize: 13,
    marginLeft: 7,
  }

  // Close resources dropdown when clicking anywhere in the window except the dropdown items
  useEffect(() => {
    function handleClick() {
      setResourcesOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const menuItems = desktopMenuItems({
    resourcesMenu,
    resourcesOpen,
    setResourcesOpen,
    dropdownIconStyle,
  })

  if (isMobile) return <MobileNavigation />

  return (
    <Header className="top-nav" style={{ ...topNavStyles }}>
      <Menu
        items={menuItems}
        mode="inline"
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: 500,
        }}
      />

      <Space size="large">
        <NavLanguageSelector />

        <ThemePicker />

        <TransactionsList
          listStyle={{
            position: 'absolute',
            top: 70,
            right: 30,
          }}
        />

        <Account />
      </Space>
    </Header>
  )
}
