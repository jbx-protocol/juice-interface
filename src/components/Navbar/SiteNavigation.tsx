import { MoreOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import Account from './Account'
import MobileNavigation from './Mobile/MobileNavigation'
import { desktopMenuItems, resourcesMenuItems } from './navigationItems'
import NavLanguageSelector from './NavLanguageSelector'
import { topNavStyles } from './navStyles'
import { ProjectSearchBar } from './ProjectSearchBar'
import ThemePicker from './ThemePicker'
import { TransactionsList } from './TransactionList'

const resourcesMenu = (
  <Menu
    items={resourcesMenuItems()}
    style={{ marginTop: -16, marginLeft: -6 }}
  />
)

export default function SiteNavigation() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
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

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <ProjectSearchBar />
        <TransactionsList
          listStyle={{
            position: 'absolute',
            top: 70,
            right: 30,
          }}
        />

        <Dropdown
          placement="bottom"
          trigger={['click']}
          dropdownRender={() => (
            <div
              style={{
                marginTop: '0.5rem',
                backgroundColor: colors.background.l0,
                border: `1px solid ${colors.stroke.tertiary}`,
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'center',
              }}
            >
              <NavLanguageSelector />
              <ThemePicker />
            </div>
          )}
        >
          <MoreOutlined
            style={{
              color: colors.icon.primary,
              fontSize: '1.25rem',
            }}
            role="button"
          />
        </Dropdown>

        <div style={{ flex: 1 }}>
          <Account />
        </div>
      </div>
    </Header>
  )
}
