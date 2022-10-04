import { LeftOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Layout, Menu, MenuProps, Space } from 'antd'
import { ProjectHeader } from 'components/Project/ProjectHeader'
import { V2V3ProjectHeaderActions } from 'components/v2v3/V2V3Project/V2V3ProjectHeaderActions'
import { VeNftContent } from 'components/veNft/VeNftContent'
import { layouts } from 'constants/styles/layouts'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import { V2VeNftPageKey } from 'models/menu-keys'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { pushMenuContent, v2v3ProjectRoute } from 'utils/routes'

type MenuItem = Required<MenuProps>['items'][number]

export const V2VeNftPageKeyTitleMap: { [k in V2VeNftPageKey]: string } = {
  mint: t`Mint VeNFT`,
  myvenfts: t`My VeNFTs`,
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
    'VeNFT',
    'venft',
    [menuItem('Mint VeNFT', 'mint'), menuItem('My VeNFTs', 'myvenfts')],
    'group',
  ),
]

export function VeNft() {
  const { isPreviewMode, projectOwnerAddress, handle } =
    useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { isDarkMode } = useContext(ThemeContext)

  const router = useRouter()
  const isOwner = useIsUserAddress(projectOwnerAddress)

  const canEditProjectHandle = isOwner && !isPreviewMode && !handle
  const activeSettingsPage = router.query.page as V2VeNftPageKey

  const handleMenuItemClick = (item: MenuItem) => {
    const key = item?.key as V2VeNftPageKey | undefined
    if (!key) return

    pushMenuContent(router, key)
  }

  return (
    <div style={layouts.maxWidth}>
      <Space direction="vertical" size={40} style={{ width: '100%' }}>
        <ProjectHeader
          actions={!isPreviewMode ? <V2V3ProjectHeaderActions /> : undefined}
          handle={handle}
          projectOwnerAddress={projectOwnerAddress}
          canEditProjectHandle={canEditProjectHandle}
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
              <Link href={v2v3ProjectRoute({ projectId, handle })}>
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

          <VeNftContent />
        </Layout>
      </Space>
    </div>
  )
}
