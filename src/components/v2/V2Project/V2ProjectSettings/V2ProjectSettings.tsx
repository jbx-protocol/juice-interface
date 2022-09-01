import { LeftOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Layout, Menu, MenuProps, Space } from 'antd'
import ProjectHeader from 'components/Project/ProjectHeader'
import V2ProjectHeaderActions from 'components/v2/V2Project/V2ProjectHeaderActions'
import { V2ProjectSettingsContent } from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettingsContent'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { pushSettingsContent } from 'utils/routes'

type MenuItem = Required<MenuProps>['items'][number]

export type V2SettingsKey =
  | 'general'
  | 'projecthandle'
  | 'reconfigurefc'
  | 'payouts'
  | 'reservedtokens'
  | 'v1tokenmigration'
  | 'venft'
  | 'transferownership'
  | 'archiveproject'

export const V2SettingsKeyTitleMap: { [k in V2SettingsKey]: string } = {
  general: t`General`,
  projecthandle: t`Project Handle`,
  reconfigurefc: t`Reconfigure Funding Cycle`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved Token Allocation`,
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
      getItem('Funding cycle', 'reconfigurefc'),
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
      getItem('V1 token migration', 'v1tokenmigration'),
      getItem('veNFT governance', 'venft'),
      getItem('Transfer ownership', 'transferownership'),
      getItem('Archive project', 'archiveproject'),
    ],
    'group',
  ),
]

export function V2ProjectSettings() {
  const {
    projectMetadata,
    isPreviewMode,
    isArchived,
    projectOwnerAddress,
    handle,
    projectId,
  } = useContext(V2ProjectContext)
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)

  const router = useRouter()

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
          projectOwnerAddress={projectOwnerAddress}
        />
        <Layout
          style={{
            minHeight: '100vh',
            background: 'transparent',
            marginBottom: '4rem',
          }}
        >
          <Layout.Sider
            style={{ background: 'transparent', marginRight: '3rem' }}
            width={250}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Link href={`/v2/p/${projectId}`}>
                <Button
                  type="link"
                  icon={<LeftOutlined />}
                  size="small"
                  style={{ color: colors.text.secondary }}
                >
                  <span>
                    <Trans>Back to project</Trans>
                  </span>
                </Button>
              </Link>
              <Menu
                defaultOpenKeys={['project', 'funding', 'manage']}
                defaultSelectedKeys={['general']}
                mode="inline"
                theme={isDarkMode ? 'dark' : 'light'}
                items={items}
                onSelect={handleMenuItemClick}
              />
            </Space>
          </Layout.Sider>

          <V2ProjectSettingsContent />
        </Layout>
      </Space>
    </div>
  )
}
