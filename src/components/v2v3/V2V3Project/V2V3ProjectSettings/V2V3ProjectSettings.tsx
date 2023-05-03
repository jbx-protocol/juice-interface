import { t } from '@lingui/macro'
import { Layout, Menu, MenuProps } from 'antd'
import Loading from 'components/Loading'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { V2V3ProjectHeaderActions } from 'components/v2v3/V2V3Project/V2V3ProjectHeaderActions'
import { ProjectSettingsContent } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsContent'
import { CV_V3 } from 'constants/cv'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import { useRouter } from 'next/router'
import { useContext, useMemo, useState } from 'react'
import { pushMenuContent, v2v3ProjectRoute } from 'utils/routes'
import { BackToProjectButton } from '../../../buttons/BackToProjectButton'

export type MenuKey = V2V3SettingsPageKey

export type V2V3SettingsPageKey =
  | 'general'
  | 'projecthandle'
  | 'reconfigurefc'
  | 'nfts'
  | 'payouts'
  | 'reservedtokens'
  | 'transferownership'
  | 'archiveproject'
  | 'governance'
  | 'tokenmigration'
  | 'upgrades'
  | 'projectnft'

type MenuItem = Required<MenuProps>['items'][number]

export const V2V3SettingsPageKeyTitleMap: {
  [k in V2V3SettingsPageKey]: string
} = {
  general: t`General`,
  projecthandle: t`Project handle`,
  reconfigurefc: t`Edit Cycle`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved token recipients`,
  nfts: t`Edit NFT collection`,
  tokenmigration: t`Token migration`,
  transferownership: t`Transfer ownership`,
  archiveproject: t`Archive project`,
  governance: t`Governance`,
  upgrades: t`Project upgrades`,
  projectnft: t`Project NFT theme`,
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

export function V2V3ProjectSettings() {
  const { cv } = useContext(V2V3ContractsContext)
  const { projectOwnerAddress, handle } = useContext(V2V3ProjectContext)
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const { forThemeOption } = useContext(ThemeContext)
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const router = useRouter()
  const isOwner = useIsUserAddress(projectOwnerAddress)
  const isMobile = useMobile()

  const canEditProjectHandle = isOwner && !handle
  const activeSettingsPage = router.query.page as
    | V2V3SettingsPageKey
    | undefined

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2V3SettingsPageKey | undefined
    if (!key) return

    pushMenuContent(router, key)

    if (isMobile) {
      setCollapsed(true)
    }
  }

  const items = useMemo(() => {
    const includeTokenMigration = cv === CV_V3
    const _items: MenuItem[] = [
      menuItem(
        'Project',
        'project',
        [
          menuItem(
            'General',
            'general',
            undefined,
            undefined,
            'menu-item-sider',
          ),
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
            'Cycle',
            'reconfigurefc',
            undefined,
            undefined,
            'menu-item-sider',
          ),
          menuItem(
            'Payouts',
            'payouts',
            undefined,
            undefined,
            'menu-item-sider',
          ),
          menuItem(
            'Reserved tokens',
            'reservedtokens',
            undefined,
            undefined,
            'menu-item-sider',
          ),
          menuItem('NFTs', 'nfts', undefined, undefined, 'menu-item-sider'),
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
          menuItem(
            'Project upgrades',
            'upgrades',
            undefined,
            undefined,
            'menu-item-sider',
          ),
          menuItem(
            'Project NFT theme',
            'projectnft',
            undefined,
            undefined,
            'menu-item-sider',
          ),
          includeTokenMigration
            ? menuItem(
                'Token migration',
                'tokenmigration',
                undefined,
                undefined,
                'menu-item-sider',
              )
            : null,
        ],
        'group',
      ),
    ]

    return _items
  }, [cv])

  if (!projectMetadata) {
    return <Loading />
  }

  return (
    <div className="my-0 mx-auto max-w-5xl p-5">
      <div className="flex flex-col gap-10">
        <ProjectHeader
          actions={<V2V3ProjectHeaderActions />}
          handle={handle}
          projectOwnerAddress={projectOwnerAddress}
          canEditProjectHandle={canEditProjectHandle}
          hideDescription={isMobile}
        />
        <Layout className="mb-16 min-h-screen w-full bg-transparent">
          <Layout.Sider
            className="settings-layout mr-12 bg-transparent"
            breakpoint="lg"
            width={200}
            collapsedWidth="0"
            collapsed={collapsed}
            onCollapse={setCollapsed}
          >
            <div className="flex flex-col gap-4">
              <BackToProjectButton
                projectPageUrl={v2v3ProjectRoute({ projectId, handle })}
              />
              <Menu
                defaultOpenKeys={['project', 'funding', 'manage']}
                selectedKeys={
                  activeSettingsPage ? [activeSettingsPage] : ['general']
                }
                defaultSelectedKeys={
                  activeSettingsPage ? [activeSettingsPage] : ['general']
                }
                mode="inline"
                theme={forThemeOption?.({
                  dark: 'dark',
                  light: 'light',
                })}
                items={items}
                onSelect={handleMenuItemClick}
              />
            </div>
          </Layout.Sider>

          <ProjectSettingsContent />
        </Layout>
      </div>
    </div>
  )
}
