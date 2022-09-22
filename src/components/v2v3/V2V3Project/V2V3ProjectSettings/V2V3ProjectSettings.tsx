import { LeftOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Layout, Menu, MenuProps, Space } from 'antd'
import ProjectHeader from 'components/Project/ProjectHeader'
import V2V3ProjectHeaderActions from 'components/v2v3/V2V3Project/V2V3ProjectHeaderActions'
import { ProjectSettingsContent } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsContent'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { V2SettingsPageKey } from 'models/menu-keys'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { pushMenuContent, v2ProjectRoute } from 'utils/routes'

type MenuItem = Required<MenuProps>['items'][number]

export const V2SettingsPageKeyTitleMap: { [k in V2SettingsPageKey]: string } = {
  general: t`General`,
  projecthandle: t`Project Handle`,
  reconfigurefc: t`Reconfigure Funding Cycle`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved Token Allocation`,
  v1tokenmigration: t`V1 Token Migration`,
  transferownership: t`Transfer Ownership`,
  archiveproject: t`Archive Project`,
  governance: t`Governance`,
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
      menuItem('Transfer ownership', 'transferownership'),
      menuItem('Archive project', 'archiveproject'),
      menuItem('Governance', 'governance'),
      featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)
        ? menuItem('V1 token migration', 'v1tokenmigration')
        : null,
    ],
    'group',
  ),
]

export function V2V3ProjectSettings() {
  const { isPreviewMode, projectOwnerAddress, handle } =
    useContext(V2V3ProjectContext)
  const { projectMetadata, isArchived, projectId } = useContext(
    ProjectMetadataContext,
  )
  const { isDarkMode } = useContext(ThemeContext)

  const router = useRouter()
  const isOwner = useIsUserAddress(projectOwnerAddress)

  const canEditProjectHandle = isOwner && !isPreviewMode && !handle
  const activeSettingsPage = router.query.page as V2SettingsPageKey

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2SettingsPageKey | undefined
    if (!key) return

    pushMenuContent(router, key)
  }

  return (
    <div style={layouts.maxWidth}>
      <Space direction="vertical" size={40} style={{ width: '100%' }}>
        <ProjectHeader
          metadata={projectMetadata}
          actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
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

          <ProjectSettingsContent />
        </Layout>
      </Space>
    </div>
  )
}
