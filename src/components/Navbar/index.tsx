import { Space } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { t } from '@lingui/macro'

import Account from './Account'
import MobileCollapse from './MobileCollapse'
import Logo from './Logo'
import OptionsCollapse from './OptionsCollapse'
import ItemDropdown from './ItemDropdown'

export default function Navbar() {
  const menuItem = (text: string, route?: string, onClick?: VoidFunction) => {
    const external = route?.startsWith('http')

    return (
      <a
        className="nav-menu-item hover-opacity"
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

  const dropDownItem = (text: string, route?: string) => {
    return (
      <a className="nav-dropdown-item" href={route}>
        {text}
      </a>
    )
  }


  const menu = () => {
    return (
      <>
        {menuItem(t`Projects`, '/#/projects')}
        {menuItem(t`FAQ`, undefined, () => {
          window.location.hash = '/'
          setTimeout(() => {
            document
              .getElementById('faq')
              ?.scrollIntoView({ behavior: 'smooth' })
          }, 0)
        })}
        {menuItem(t`Discord`, 'https://discord.gg/6jXrJSyDFf')}
        <ItemDropdown
          heading="Resources"
          dropdownItems={[
            dropDownItem(t`Docs`, 'https://docs.juicebox.money'),
            dropDownItem(t`Blog`, 'https://blog.juicebox.money'),
            dropDownItem(t`Workspace`, 'https://juicebox.notion.site'),
            dropDownItem(
              t`Podcast`,
              'https://open.spotify.com/show/4G8ji7vofcOx2acXcjXIa4?si=1e5e6e171ed744e8',
            ),
          ]}
        />
      </>
    )
  }

  return window.innerWidth > 900 ? (
    <Header className="top-nav">
      <Space className="top-left-nav" size="large">
        <a href="/" style={{ display: 'inline-block' }}>
          {<Logo />}
        </a>
        {menu()}
      </Space>

      <Space className="top-right-nav" size="middle">
        <OptionsCollapse />
        <Account />
      </Space>
    </Header>
  ) : (
    <MobileCollapse menu={menu()} />
  )
}
