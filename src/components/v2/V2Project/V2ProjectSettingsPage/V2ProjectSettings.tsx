import { Layout, Menu, MenuProps } from 'antd'

import Link from 'next/link'
import { useState } from 'react'

import V2ProjectSettingsContent from './V2ProjectSettingsContent'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  children?: MenuItem[],
  type?: 'group' | 'divider',
): MenuItem {
  return {
    key,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem(
    'Project',
    'project',
    [getItem('General', 'project1'), getItem('Project handle', 'project2')],
    'group',
  ),
  getItem('', 'div1', undefined, 'divider'),
  getItem(
    'Funding',
    'funding',
    [
      getItem('Funding cycle', 'funding1'),
      getItem('Payouts', 'funding2'),
      getItem('Reserved tokens', 'funding3'),
    ],
    'group',
  ),
  getItem('', 'div2', undefined, 'divider'),
  getItem(
    'Manage',
    'manage',
    [
      getItem('Payment addresses', 'manage1'),
      getItem('V1 token migration', 'manage2'),
      getItem('veNFT', 'manage3'),
    ],
    'group',
  ),
]

const V2ProjectSettings = () => {
  const [activeKey, setActiveKey] = useState<string | undefined>('project1')

  const handleMenuItemClick = (item: MenuItem) => {
    setActiveKey(item?.key?.toString())
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Layout.Sider style={{ background: 'transparent' }}>
        <Link href={`project`}>{`< Back to Project`}</Link>
        <Menu
          defaultOpenKeys={['project', 'funding', 'manage']}
          defaultSelectedKeys={['project1']}
          mode="inline"
          theme="dark"
          items={items}
          onSelect={handleMenuItemClick}
        />
      </Layout.Sider>
      <V2ProjectSettingsContent activeKey={activeKey} />
    </Layout>
  )
}

export default V2ProjectSettings
