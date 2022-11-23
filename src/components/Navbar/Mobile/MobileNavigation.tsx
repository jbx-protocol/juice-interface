import { MenuOutlined } from '@ant-design/icons'
import { Collapse, Menu } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Header } from 'antd/lib/layout/layout'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Logo from '../Logo'
import { mobileNavItems } from '../navigationItems'
import { TransactionsList } from '../TransactionList'

const NAV_EXPANDED_KEY = 0

export default function MobileNavigation() {
  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const { isConnected, disconnect } = useWallet()

  const isNavExpanded = activeKey === NAV_EXPANDED_KEY

  const collapseNav = () => setActiveKey(undefined)
  const expandNav = () => setActiveKey(NAV_EXPANDED_KEY)
  const toggleNav = () => (isNavExpanded ? collapseNav() : expandNav())

  // Close collapse when clicking anywhere in the window except the collapse items
  useEffect(() => {
    function handleClick() {
      setActiveKey(undefined)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <Header
      // ant override for .top-nav
      className="top-nav top-nav-mobile fixed z-[1] flex h-16 w-full items-center  justify-between bg-smoke-25 py-4 px-2 leading-[64px] dark:bg-slate-800"
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <Collapse className="border-none" activeKey={activeKey}>
        <CollapsePanel
          className="border-none"
          key={0}
          showArrow={false}
          header={
            <div className="flex w-full justify-between">
              <Link href="/">
                <a className="inline-block">{<Logo className="h-8" />}</a>
              </Link>
              <div className="flex items-center gap-7">
                <TransactionsList listClassName="absolute top-12 left-0 right-0 p-3" />
                <MenuOutlined
                  className="text-2xl text-black dark:text-slate-100"
                  onClick={toggleNav}
                  role="button"
                />
              </div>
            </div>
          }
        >
          <Menu
            mode="inline"
            items={mobileNavItems({ isConnected, disconnect, collapseNav })}
            defaultSelectedKeys={['resources']}
          />
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
