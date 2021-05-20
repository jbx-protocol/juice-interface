import { Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'

import Account from './Account'

export default function Navbar() {
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
      }}
    >
      <Menu
        mode="horizontal"
        style={{
          display: 'inline-block',
          border: 'none',
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
        <Menu.Item key="projects">
          {menuItem('Projects', '/#/projects')}
        </Menu.Item>
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
      {/* <ThemePicker /> */}
      <div className="hide-mobile">
        <Account />
      </div>
    </Header>
  )
}
