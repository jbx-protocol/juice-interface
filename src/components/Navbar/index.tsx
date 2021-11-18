import { Collapse, Space } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { Header } from 'antd/lib/layout/layout'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'

import Account from './Account'
import ThemePicker from './ThemePicker'

export default function Navbar() {
  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const menuItem = (text: string, route?: string, onClick?: VoidFunction) => {
    const external = route?.startsWith('http')

    return (
      <a
        className="hover-opacity"
        style={{
          fontWeight: 600,
          color: colors.text.primary,
        }}
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

  const logo = (height = 40) => (
    <img
      style={{ height }}
      src={
        forThemeOption &&
        forThemeOption({
          [ThemeOption.light]: '/assets/juice_logo-ol.png',
          [ThemeOption.dark]: '/assets/juice_logo-od.png',
        })
      }
      alt="Juicebox logo"
    />
  )

  const menu = () => {
    return (
      <>
        {menuItem('Projects', '/#/projects')}
        {menuItem('FAQ', undefined, () => {
          window.location.hash = '/'
          setTimeout(() => {
            document
              .getElementById('faq')
              ?.scrollIntoView({ behavior: 'smooth' })
          }, 0)
        })}
        {menuItem('Docs', 'https://docs.juicebox.money')}
        {menuItem('Blog', 'https://blog.juicebox.money')}
        {menuItem('Discord', 'https://discord.gg/6jXrJSyDFf')}
        {menuItem('Notion', 'https://juicebox.notion.site')}
      </>
    )
  }

  return window.innerWidth > 900 ? (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: colors.background.l0,
      }}
    >
      <Space size="large" style={{ flex: 1 }}>
        <a href="/" style={{ display: 'inline-block' }}>
          {logo()}
        </a>
        {menu()}
      </Space>
      <Space size="middle">
        <ThemePicker />
        <div className="hide-mobile">
          <Account />
        </div>
      </Space>
    </Header>
  ) : (
    <Header
      style={{
        background: colors.background.l0,
        zIndex: 100,
        padding: 8,
      }}
      onClick={e => {
        setActiveKey(undefined)
        e.stopPropagation()
      }}
    >
      <Collapse style={{ border: 'none' }} activeKey={activeKey}>
        <CollapsePanel
          style={{ border: 'none' }}
          key={0}
          showArrow={false}
          header={
            <Space
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              {logo(30)}
              <MenuOutlined style={{ color: colors.icon.primary }} />
            </Space>
          }
          extra={<ThemePicker />}
        >
          <Space direction="vertical" size="middle">
            {menu()}
            <Account />
          </Space>
        </CollapsePanel>
      </Collapse>
    </Header>
  )
}
