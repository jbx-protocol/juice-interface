import { Trans } from '@lingui/macro'
import { Button, Layout, Menu, MenuProps } from 'antd'
import { ProjectPage } from 'models/project-visibility'

import { useState } from 'react'

import V2ProjectSettingsContent from './V2ProjectSettingsContent'

type MenuItem = Required<MenuProps>['items'][number]

export type V2SettingsContentKey =
  | 'general'
  | 'project-handle'
  | 'payouts'
  | 'reserved-tokens'
  | 'payment-addresses'
  | 'v1-token-migration'
  | 'venft'
  | 'transfer-ownership'
  | 'archive-project'

export const V2SettingsKeyTitleMap: Record<V2SettingsContentKey, string> = {
  general: 'General',
  'project-handle': 'Project Handle',
  payouts: 'Payouts',
  'reserved-tokens': 'Reserved Tokens',
  'payment-addresses': 'Payment Addresses',
  'v1-token-migration': 'V1 Token Migration',
  venft: 'VeNFT Governance',
  'transfer-ownership': 'Transfer Ownership',
  'archive-project': 'Archive Project',
}

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
      getItem('veNFT governance', 'venft'),
      getItem('Transfer ownership', 'transfer-ownership'),
      getItem('Archive project', 'archive-project'),
    ],
    'group',
  ),
]

const V2ProjectSettings = ({
  setActivePage,
}: {
  setActivePage: (page: ProjectPage) => void
}) => {
  const [activeKey, setActiveKey] = useState<V2SettingsContentKey>('general')

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2SettingsContentKey
    setActiveKey(key)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Layout.Sider style={{ background: 'transparent' }}>
        <Button onClick={() => setActivePage('info')} type="link">
          <Trans>Back to project</Trans>
        </Button>
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
