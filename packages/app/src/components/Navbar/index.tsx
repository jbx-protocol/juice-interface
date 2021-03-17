import { Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import { useUserBudgetSelector } from 'hooks/AppSelector'
import React, { useContext } from 'react'

import Account from './Account'

export default function Navbar({}: {}) {
  const userBudget = useUserBudgetSelector()
  const { userAddress } = useContext(UserContext)

  const menuItem = (text: string, route?: string, onClick?: VoidFunction) => {
    const external = route?.startsWith('http')

    return (
      <a
        style={{ fontWeight: 600, color: colors.textPrimary }}
        href={route}
        onClick={onClick}
        {...(external
          ? {
              target: '_blank',
              rel: 'noreferrer',
            }
          : {})}
      >
        {text}
      </a>
    )
  }

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: colors.background,
      }}
    >
      <Menu
        mode="horizontal"
        theme="dark"
        style={{
          display: 'inline-block',
          border: 'none',
          background: colors.background,
        }}
        selectable={false}
      >
        <Menu.Item key="logo" style={{ marginLeft: 0 }}>
          <a href="/" style={{ display: 'inline-block' }}>
            <img
              style={{ height: 40 }}
              src="/assets/juice_logo-od.png"
              alt="Juice logo"
            />
          </a>
        </Menu.Item>
        {userBudget && userAddress ? (
          <Menu.Item key="budget">
            {menuItem('Dashboard', '/#/' + userAddress)}
          </Menu.Item>
        ) : null}
        {
          <Menu.Item key="faq">
            {menuItem('FAQ', undefined, () => {
              window.location.hash = '/'

              setTimeout(() => {
                document
                  .getElementById('faq')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }, 0)
            })}
          </Menu.Item>
        }
        {
          <Menu.Item key="fluid-dynamics">
            {menuItem(
              'Fluid dynamics',
              'https://www.figma.com/file/ZklsxqZUsjK3XO5BksCyE4/Fluid-Dynamics?node-id=0%3A1',
            )}
          </Menu.Item>
        }
      </Menu>
      <div className="hide-mobile">
        <Account />
      </div>
    </Header>
  )
}
