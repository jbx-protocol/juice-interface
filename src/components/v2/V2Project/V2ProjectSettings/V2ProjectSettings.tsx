import { LeftOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Layout, Menu, MenuProps, Space } from 'antd'
import ProjectHeader from 'components/Project/ProjectHeader'
import V2ProjectHeaderActions from 'components/v2/V2Project/V2ProjectHeaderActions'
import { V2ProjectSettingsContent } from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettingsContent'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { pushSettingsContent, v2ProjectRoute } from 'utils/routes'

type MenuItem = Required<MenuProps>['items'][number]

export type V2SettingsPageKey =
  | 'general'
  | 'projecthandle'
  | 'reconfigurefc'
  | 'payouts'
  | 'reservedtokens'
  | 'v1tokenmigration'
  | 'venft'
  | 'transferownership'
  | 'archiveproject'
  | 'tokenweightedvoting'

export const V2SettingsPageKeyTitleMap: { [k in V2SettingsPageKey]: string } = {
  general: t`General`,
  projecthandle: t`Project Handle`,
  reconfigurefc: t`Reconfigure Funding Cycle`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved Token Allocation`,
  v1tokenmigration: t`V1 Token Migration`,
  venft: t`VeNFT Governance`,
  transferownership: t`Transfer Ownership`,
  archiveproject: t`Archive Project`,
  tokenweightedvoting: t`Token-Weighted Voting`,
}

function menuItem(
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
  }
}

const items: MenuItem[] = [
  menuItem(
    'Project',
    'project',
    [
      menuItem('General', 'general'),
      menuItem('Project handle', 'projecthandle'),
    ],
    'group',
  ),
  menuItem('', 'div1', undefined, 'divider'),
  menuItem(
    'Funding',
    'funding',
    [
      menuItem('Funding cycle', 'reconfigurefc'),
      menuItem('Payouts', 'payouts'),
      menuItem('Reserved tokens', 'reservedtokens'),
    ],
    'group',
  ),
  menuItem('', 'div2', undefined, 'divider'),
  menuItem(
    'Manage',
    'manage',
    [
      menuItem('V1 token migration', 'v1tokenmigration'),
      featureFlagEnabled(FEATURE_FLAGS.VENFT)
        ? menuItem('veNFT governance', 'venft')
        : null,
      menuItem('Transfer ownership', 'transferownership'),
      menuItem('Archive project', 'archiveproject'),
      menuItem('Token-Weighted Voting', 'tokenweightedvoting'),
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
  const { isDarkMode } = useContext(ThemeContext)

  const router = useRouter()
  const isOwner = useIsUserAddress(projectOwnerAddress)

  const canEditProjectHandle = isOwner && !isPreviewMode && !handle
  const activeSettingsPage = router.query.page as V2SettingsPageKey

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2SettingsPageKey | undefined
    if (!key) return

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
          canEditProjectHandle={canEditProjectHandle}
          projectId={projectId}
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
              <Link href={v2ProjectRoute({ projectId, handle })}>
                <Button type="link" icon={<LeftOutlined />} size="small">
                  <span>
                    <Trans>Back to project</Trans>
                  </span>
                </Button>
              </Link>
              <Menu
                defaultOpenKeys={['project', 'funding', 'manage']}
                defaultSelectedKeys={[activeSettingsPage]}
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
