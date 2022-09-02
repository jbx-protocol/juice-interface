import { Divider, Layout } from 'antd'
import {
  V2SettingsPageKey,
  V2SettingsPageKeyTitleMap,
} from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import { ThemeContext } from 'contexts/themeContext'
import { useRouter } from 'next/router'
import { useContext, useMemo } from 'react'
import { V1V2TokenMigrationSettingsPage } from './pages/V1V2TokenMigrationSettingsPage/V1V2TokenMigrationSettingsPage'
import { V2ArchiveProjectSettingsPage } from './pages/V2ArchiveProjectSettingsPage'
import { V2PayoutsSettingsPage } from './pages/V2PayoutsSettingsPage/V2PayoutsSettingsPage'
import { V2ProjectDetailsSettingsPage } from './pages/V2ProjectDetailsSettingsPage'
import { V2ProjectHandleSettingsPage } from './pages/V2ProjectHandleSettingsPage'
import { V2ReconfigureFundingCycleSettingsPage } from './pages/V2ProjectReconfigureFundingCycleSettingsPage'
import { V2ReservedTokensSettingsPage } from './pages/V2ReservedTokensSettingsPage/V2ReservedTokensSettingsPage'
import { V2TransferOwnershipSettingsPage } from './pages/V2TransferOwnershipSettingsPage'
import { V2VeNftSettingsPage } from './pages/V2VeNftSettingsPage'

const SettingsPageComponents: { [k in V2SettingsPageKey]: () => JSX.Element } =
  {
    general: V2ProjectDetailsSettingsPage,
    projecthandle: V2ProjectHandleSettingsPage,
    reconfigurefc: V2ReconfigureFundingCycleSettingsPage,
    payouts: V2PayoutsSettingsPage,
    reservedtokens: V2ReservedTokensSettingsPage,
    v1tokenmigration: V1V2TokenMigrationSettingsPage,
    venft: V2VeNftSettingsPage,
    transferownership: V2TransferOwnershipSettingsPage,
    archiveproject: V2ArchiveProjectSettingsPage,
  }

const DEFAULT_SETTINGS_PAGE = 'general'

export function V2ProjectSettingsContent() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const router = useRouter()

  const activeSettingsPage =
    (router.query.page as V2SettingsPageKey) ?? DEFAULT_SETTINGS_PAGE
  const ActiveSettingsPage = useMemo(
    () => SettingsPageComponents[activeSettingsPage],
    [activeSettingsPage],
  )

  return (
    <Layout style={{ background: 'transparent' }}>
      <h2 style={{ color: colors.text.primary, marginBottom: 0 }}>
        {V2SettingsPageKeyTitleMap[activeSettingsPage]}
      </h2>

      <Divider />

      <Layout.Content style={{ margin: '0 16px' }}>
        <ActiveSettingsPage />
      </Layout.Content>
    </Layout>
  )
}
