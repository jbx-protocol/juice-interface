import { t, Trans } from '@lingui/macro'
import { Button, Layout, Menu, MenuProps } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import V2ProjectSettingsContent from './V2ProjectSettingsContent'

type MenuItem = Required<MenuProps>['items'][number]

export type V2SettingsContentKey =
  | 'general'
  | 'projecthandle'
  | 'payouts'
  | 'reservedtokens'
  | 'paymentaddresses'
  | 'v1tokenmigration'
  | 'venft'
  | 'transferownership'
  | 'archiveproject'

export const V2SettingsKeyTitleMap: Record<V2SettingsContentKey, string> = {
  general: t`General`,
  projecthandle: t`Project Handle`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved Tokens`,
  paymentaddresses: t`Payment Addresses`,
  v1tokenmigration: t`V1 Token Migration`,
  venft: t`VeNFT Governance`,
  transferownership: t`Transfer Ownership`,
  archiveproject: t`Archive Project`,
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
    [getItem('General', 'general'), getItem('Project handle', 'projecthandle')],
    'group',
  ),
  getItem('', 'div1', undefined, 'divider'),
  getItem(
    'Funding',
    'funding',
    [
      getItem('Payouts', 'payouts'),
      getItem('Reserved tokens', 'reservedtokens'),
    ],
    'group',
  ),
  getItem('', 'div2', undefined, 'divider'),
  getItem(
    'Manage',
    'manage',
    [
      getItem('Payment addresses', 'paymentaddresses'),
      getItem('V1 token migration', 'v1tokenmigration'),
      getItem('veNFT governance', 'venft'),
      getItem('Transfer ownership', 'transferownership'),
      getItem('Archive project', 'archiveproject'),
    ],
    'group',
  ),
]

const V2ProjectSettings = () => {
  const { projectId } = useContext(V2ProjectContext)
  const router = useRouter()

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2SettingsContentKey
    router.push(
      `/v2/p/${projectId}?page=settings&settingsPage=${key}`,
      undefined,
      {
        shallow: true,
      },
    )
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Layout.Sider style={{ background: 'transparent' }}>
        <Button
          onClick={() =>
            router.push(`/v2/p/${projectId}?page=info`, undefined, {
              shallow: true,
            })
          }
          type="link"
        >
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
      <V2ProjectSettingsContent />
    </Layout>
  )
}

export default V2ProjectSettings
