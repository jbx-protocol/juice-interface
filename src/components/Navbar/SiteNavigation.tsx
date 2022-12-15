import { Menu, Space } from 'antd'
import QuickProjectSearch from 'components/QuickProjectSearch'
import useMobile from 'hooks/Mobile'
import { CSSProperties, useEffect, useState } from 'react'

import Account from './Account'
import MobileNavigation from './Mobile/MobileNavigation'
import { desktopMenuItems, resourcesMenuItems } from './navigationItems'
import NavLanguageSelector from './NavLanguageSelector'
import ThemePicker from './ThemePicker'
import { TransactionsList } from './TransactionList'

const resourcesMenu = (
  <Menu className="mt-[-16px] ml-[-6px]" items={resourcesMenuItems()} />
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
    // top-nav is antd override
    <nav className="top-nav z-[1] flex h-16 items-center justify-between bg-smoke-25 py-2 px-12 leading-[64px] dark:bg-slate-800">
      <Menu
        className="flex w-[500px] flex-row"
        items={menuItems}
        mode="inline"
      />

      <Space size="large">
        <NavLanguageSelector />

        <ThemePicker />

        <TransactionsList listClassName="absolute top-[70px] right-[30px]" />

        <Account />

        <QuickProjectSearch />
      </Space>
    </nav>
  )
}
