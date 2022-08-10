import { Layout, Menu, MenuProps } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import Link from 'next/link'
import { useContext, useState } from 'react'

import V2ProjectSettingsContent from './V2ProjectSettingsContent'

type MenuItem = Required<MenuProps>['items'][number]

export type V2SettingsContentKey =
  | 'general'
  | 'project-handle'
  | 'funding-cycle'
  | 'payouts'
  | 'reserved-tokens'
  | 'payment-addresses'
  | 'v1-token-migration'
  | 'venft'

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
    [
      getItem('General', 'general'),
      getItem('Project handle', 'project-handle'),
    ],
    'group',
  ),
  getItem('', 'div1', undefined, 'divider'),
  getItem(
    'Funding',
    'funding',
    [
      getItem('Funding cycle', 'funding-cycle'),
      getItem('Payouts', 'payouts'),
      getItem('Reserved tokens', 'reserved-tokens'),
    ],
    'group',
  ),
  getItem('', 'div2', undefined, 'divider'),
  getItem(
    'Manage',
    'manage',
    [
      getItem('Payment addresses', 'payment-addresses'),
      getItem('V1 token migration', 'v1-token-migration'),
      getItem('veNFT', 'venft'),
    ],
    'group',
  ),
]

const V2ProjectSettings = () => {
  const { projectId } = useContext(V2ProjectContext)
  const [activeKey, setActiveKey] = useState<V2SettingsContentKey>('general')

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2SettingsContentKey
    setActiveKey(key)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Layout.Sider style={{ background: 'transparent' }}>
        <Link href={`/v2/p/${projectId}`}>{`< Back to Project`}</Link>
        <Menu
          defaultOpenKeys={['project', 'funding', 'manage']}
          defaultSelectedKeys={['general']}
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
