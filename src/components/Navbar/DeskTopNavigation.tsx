import { Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { CSSProperties, useEffect, useState } from 'react'
import Account from './Account'
import { desktopMenuItems, resourcesMenuItems } from './constants'
import { topNavStyles, topRightNavStyles } from './navStyles'
import { TransactionsList } from './TransactionList'

const resourcesMenu = (
  <Menu
    items={resourcesMenuItems()}
    style={{ marginTop: -16, marginLeft: -6 }}
  />
)

export default function DeskTopNavigation({
  desktop,
}: {
  desktop?: boolean
  onClickMenuItems?: VoidFunction
}) {
  const [resourcesOpen, setResourcesOpen] = useState<boolean>(false)
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

  return (
    <Header className="top-nav" style={{ ...topNavStyles }}>
      <Menu
        items={menuItems}
        mode="inline"
        style={{
          display: 'flex',
          flexDirection: desktop ? 'row' : 'column',
          width: desktop ? 500 : 'auto',
        }}
      />
      <Menu
        style={topRightNavStyles}
        items={[
          {
            key: 'transaction-list',
            label: (
              <TransactionsList
                listStyle={{
                  position: 'absolute',
                  top: 70,
                  right: 30,
                }}
              />
            ),
          },
          {
            key: 'account',
            label: <Account />,
          },
        ]}
      />
    </Header>
  )
}
