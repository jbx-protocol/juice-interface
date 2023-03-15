import { Menu } from 'antd'
import QuickProjectSearch from 'components/QuickProjectSearch'
import useMobile from 'hooks/Mobile'
import { CSSProperties, useEffect, useState } from 'react'
import { BrandUpdateBanner } from './BrandUpdateBanner'
import MobileNavigation from './Mobile/MobileNavigation'
import { desktopMenuItems, resourcesMenuItems } from './navigationItems'
import NavLanguageSelector from './NavLanguageSelector'
import ThemePicker from './ThemePicker'
import { TransactionsList } from './TransactionList'
import WalletButton from './WalletButton'

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
    resourcesMenuProps: { items: resourcesMenuItems() },
    resourcesOpen,
    setResourcesOpen,
    dropdownIconStyle,
  })

  if (isMobile) return <MobileNavigation />

  return (
    <>
      <BrandUpdateBanner />
      {/* top-nav is antd override */}
      <nav className="top-nav z-[1] flex h-16 items-center justify-between bg-smoke-25 px-12 py-11 leading-[64px] dark:bg-slate-800">
        <Menu className="flex flex-row" items={menuItems} mode="inline" />

        <div className="flex items-center gap-6">
          <NavLanguageSelector />

          <ThemePicker />

          <TransactionsList listClassName="absolute top-[70px] right-[30px]" />

          <WalletButton />

          <QuickProjectSearch />
        </div>
      </nav>
    </>
  )
}
