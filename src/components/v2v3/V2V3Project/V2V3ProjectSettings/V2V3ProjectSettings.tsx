import { t } from '@lingui/macro'
import { Layout, Menu, MenuProps, Space } from 'antd'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { V2V3ProjectHeaderActions } from 'components/v2v3/V2V3Project/V2V3ProjectHeaderActions'
import { ProjectSettingsContent } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsContent'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { layouts } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import { V2V3SettingsPageKey } from 'models/menu-keys'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { pushMenuContent } from 'utils/routes'
import { BackToProjectButton } from '../BackToProjectButton'

type MenuItem = Required<MenuProps>['items'][number]

export const V2V3SettingsPageKeyTitleMap: {
  [k in V2V3SettingsPageKey]: string
} = {
  general: t`General`,
  projecthandle: t`Project handle`,
  reconfigurefc: t`Reconfigure Funding Cycle`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved token allocation`,
  v1tokenmigration: t`V1 token migration`,
  transferownership: t`Transfer ownership`,
  archiveproject: t`Archive project`,
  governance: t`Governance`,
  upgrades: t`Project upgrades`,
}

function menuItem(
  label: React.ReactNode,
  key: React.Key,
  children?: MenuItem[],
  type?: 'group' | 'divider',
  className?: string,
): MenuItem {
  return {
    key,
    children,
    label,
    type,
    className,
  }
}

const items: MenuItem[] = [
  menuItem(
    'Project',
    'project',
    [
      menuItem('General', 'general', undefined, undefined, 'menu-item-sider'),
      menuItem(
        'Project handle',
        'projecthandle',
        undefined,
        undefined,
        'menu-item-sider',
      ),
    ],
    'group',
  ),
  menuItem('', 'div1', undefined, 'divider'),
  menuItem(
    'Funding',
    'funding',
    [
      menuItem(
        'Funding cycle',
        'reconfigurefc',
        undefined,
        undefined,
        'menu-item-sider',
      ),
      menuItem('Payouts', 'payouts', undefined, undefined, 'menu-item-sider'),
      menuItem(
        'Reserved tokens',
        'reservedtokens',
        undefined,
        undefined,
        'menu-item-sider',
      ),
    ],
    'group',
  ),
  menuItem('', 'div2', undefined, 'divider'),
  menuItem(
    'Manage',
    'manage',
    [
      menuItem(
        'Transfer ownership',
        'transferownership',
        undefined,
        undefined,
        'menu-item-sider',
      ),
      menuItem(
        'Archive project',
        'archiveproject',
        undefined,
        undefined,
        'menu-item-sider',
      ),
      menuItem(
        'Governance',
        'governance',
        undefined,
        undefined,
        'menu-item-sider',
      ),
      featureFlagEnabled(FEATURE_FLAGS.PROJECT_CONTRACT_UPDGRADES)
        ? menuItem(
            'Project upgrades',
            'upgrades',
            undefined,
            undefined,
            'menu-item-sider',
          )
        : null,
      featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)
        ? menuItem(
            'V1 token migration',
            'v1tokenmigration',
            undefined,
            undefined,
            'menu-item-sider',
          )
        : null,
    ],
    'group',
  ),
]

export function V2V3ProjectSettings() {
  const { isPreviewMode, projectOwnerAddress, handle } =
    useContext(V2V3ProjectContext)
  const { isDarkMode } = useContext(ThemeContext)

  const [collapsed, setCollapsed] = useState<boolean>(false)

  const router = useRouter()
  const isOwner = useIsUserAddress(projectOwnerAddress)
  const isMobile = useMobile()

  const canEditProjectHandle = isOwner && !isPreviewMode && !handle
  const activeSettingsPage = router.query.page as V2V3SettingsPageKey

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2V3SettingsPageKey | undefined
    if (!key) return

    pushMenuContent(router, key)

    if (isMobile) {
      setCollapsed(true)
    }
  }

  return (
    <div style={layouts.maxWidth}>
      <Space direction="vertical" size={40} style={{ width: '100%' }}>
        <ProjectHeader
          actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
          handle={handle}
          projectOwnerAddress={projectOwnerAddress}
          canEditProjectHandle={canEditProjectHandle}
          hideDescription={isMobile}
        />
        <Layout
          style={{
            minHeight: '100vh',
            background: 'transparent',
            marginBottom: '4rem',
            width: '100%',
          }}
        >
          <Layout.Sider
            breakpoint="lg"
            style={{ background: 'transparent', marginRight: '3rem' }}
            width={200}
            collapsedWidth="0"
            className="settings-layout"
            collapsed={collapsed}
            onCollapse={setCollapsed}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <BackToProjectButton />
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
