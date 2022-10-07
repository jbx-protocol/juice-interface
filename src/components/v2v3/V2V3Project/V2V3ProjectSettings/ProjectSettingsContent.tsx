import { Divider, Layout } from 'antd'
import { V2V3SettingsPageKeyTitleMap } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/V2V3ProjectSettings'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3SettingsPageKey } from 'models/menu-keys'
import { useRouter } from 'next/router'
import { useContext, useMemo } from 'react'
import { ArchiveProjectSettingsPage } from './pages/ArchiveProjectSettingsPage'
import { GovernanceSettingsPage } from './pages/GovernanceSettingsPage'
import { PayoutsSettingsPage } from './pages/PayoutsSettingsPage'
import { ProjectDetailsSettingsPage } from './pages/ProjectDetailsSettingsPage'
import { ProjectHandleSettingsPage } from './pages/ProjectHandleSettingsPage'
import { ProjectUpgradesPage } from './pages/ProjectUpgradesPage'
import { ReconfigureFundingCycleSettingsPage } from './pages/ReconfigureFundingCycleSettingsPage'
import { ReservedTokensSettingsPage } from './pages/ReservedTokensSettingsPage'
import { TransferOwnershipSettingsPage } from './pages/TransferOwnershipSettingsPage'
import { V1V2TokenMigrationSettingsPage } from './pages/V1V2TokenMigrationSettingsPage'

const SettingsPageComponents: {
  [k in V2V3SettingsPageKey]: () => JSX.Element | null
} = {
  general: ProjectDetailsSettingsPage,
  projecthandle: ProjectHandleSettingsPage,
  reconfigurefc: ReconfigureFundingCycleSettingsPage,
  payouts: PayoutsSettingsPage,
  reservedtokens: ReservedTokensSettingsPage,
  v1tokenmigration: V1V2TokenMigrationSettingsPage,
  transferownership: TransferOwnershipSettingsPage,
  archiveproject: ArchiveProjectSettingsPage,
  governance: GovernanceSettingsPage,
  upgrades: ProjectUpgradesPage,
}

const DEFAULT_SETTINGS_PAGE = 'general'

export function ProjectSettingsContent() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const router = useRouter()

  const activeSettingsPage =
    (router.query.page as V2V3SettingsPageKey) ?? DEFAULT_SETTINGS_PAGE
  const ActiveSettingsPage = useMemo(
    () => SettingsPageComponents[activeSettingsPage],
    [activeSettingsPage],
  )

  return (
    <Layout style={{ background: 'transparent' }}>
      <h2 style={{ color: colors.text.primary, marginBottom: 0 }}>
        {V2V3SettingsPageKeyTitleMap[activeSettingsPage]}
      </h2>

      <Divider />

      <Layout.Content style={{ margin: '0 16px' }}>
        <ActiveSettingsPage />
      </Layout.Content>
    </Layout>
  )
}
