import { t, Trans } from '@lingui/macro'
import { Button, Layout, Menu, MenuProps, Space } from 'antd'
import ProjectHeader from 'components/Project/ProjectHeader'
import V2ProjectHeaderActions from 'components/v2/V2Project/V2ProjectHeaderActions'
import V2ProjectSettingsContent from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettingsContent'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { pushSettingsContent } from 'utils/routes'

import { layouts } from 'constants/styles/layouts'

type MenuItem = Required<MenuProps>['items'][number]

export type V2SettingsKey =
  | 'general'
  | 'projecthandle'
  | 'reconfigurefc'
  | 'payouts'
  | 'reservedtokens'
  | 'paymentaddresses'
  | 'v1tokenmigration'
  | 'venft'
  | 'transferownership'
  | 'archiveproject'

export const V2SettingsKeyTitleMap: { [k in V2SettingsKey]: string } = {
  general: t`General`,
  projecthandle: t`Project Handle`,
  reconfigurefc: t`Reconfigure Funding Cycle`,
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
      getItem('Reconfigure FC', 'reconfigurefc'),
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
  const router = useRouter()
  const {
    projectMetadata,
    isPreviewMode,
    isArchived,
    projectOwnerAddress,
    handle,
  } = useContext(V2ProjectContext)
  const isOwner = useIsUserAddress(projectOwnerAddress)
  const showAddHandle = isOwner && !isPreviewMode && !handle

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2SettingsKey
    pushSettingsContent(router, key)
  }

  return (
    <div style={layouts.maxWidth}>
      <Space direction="vertical" size={40} style={{ width: '100%' }}>
        <ProjectHeader
          metadata={projectMetadata}
          actions={!isPreviewMode ? <V2ProjectHeaderActions /> : undefined}
          isArchived={isArchived}
          handle={handle}
          owner={projectOwnerAddress}
          onClickSetHandle={
            showAddHandle
              ? () => pushSettingsContent(router, 'projecthandle')
              : undefined
          }
        />
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <Layout.Sider style={{ background: 'transparent' }}>
            <Button
              onClick={() =>
                router.push(`/v2/p/4417`, undefined, {
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
      </Space>
    </div>
  )
}

export default V2ProjectSettings
