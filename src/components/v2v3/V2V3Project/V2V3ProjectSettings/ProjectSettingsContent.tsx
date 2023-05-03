import { Divider, Layout } from 'antd'
import {
  V2V3SettingsPageKey,
  V2V3SettingsPageKeyTitleMap,
} from 'components/v2v3/V2V3Project/V2V3ProjectSettings/V2V3ProjectSettings'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { ArchiveProjectSettingsPage } from './pages/ArchiveProjectSettingsPage'
import { EditNftsPage } from './pages/EditNftsPage'
import { GovernanceSettingsPage } from './pages/GovernanceSettingsPage'
import { ProjectNftSettingsPage } from './pages/ProjectNftSettingsPage'
import { PayoutsSettingsPage } from './pages/PayoutsSettingsPage'
import { ProjectDetailsSettingsPage } from './pages/ProjectDetailsSettingsPage/ProjectDetailsSettingsPage'
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
  nfts: EditNftsPage,
  payouts: PayoutsSettingsPage,
  reservedtokens: ReservedTokensSettingsPage,
  tokenmigration: V1V2TokenMigrationSettingsPage,
  transferownership: TransferOwnershipSettingsPage,
  archiveproject: ArchiveProjectSettingsPage,
  governance: GovernanceSettingsPage,
  upgrades: ProjectUpgradesPage,
  projectnft: ProjectNftSettingsPage,
}

const DEFAULT_SETTINGS_PAGE = 'general'

export function ProjectSettingsContent() {
  const router = useRouter()

  const activeSettingsPage =
    (router.query.page as V2V3SettingsPageKey) ?? DEFAULT_SETTINGS_PAGE
  const ActiveSettingsPage = useMemo(
    () => SettingsPageComponents[activeSettingsPage],
    [activeSettingsPage],
  )

  return (
    <Layout className="bg-transparent pl-4">
      <h2 className="mb-0 font-heading text-2xl font-medium text-black dark:text-slate-100">
        {V2V3SettingsPageKeyTitleMap[activeSettingsPage]}
      </h2>

      <Divider className="mt-3" />

      <Layout.Content className="my-0">
        <ActiveSettingsPage />
      </Layout.Content>
    </Layout>
  )
}
