import { Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'

import Account from './Account'

export default function Navbar() {
  const { userHasProjects } = useContext(UserContext)
  const { userAddress } = useContext(UserContext)

  const menuItem = (text: string, route?: string, onClick?: VoidFunction) => {
    const external = route?.startsWith('http')

    return (
      <a
        style={{ fontWeight: 600 }}
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
        <Menu.Item key="explore">
          {menuItem('Explore', '/#/projects')}
        </Menu.Item>
        {userHasProjects ? (
          <Menu.Item key="budget">
            {menuItem('Your projects', '/#/owner/' + userAddress)}
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
              'https://www.figma.com/file/dHsQ7Bt3ryXbZ2sRBAfBq5/Fluid-Dynamics?node-id=0%3A1',
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
