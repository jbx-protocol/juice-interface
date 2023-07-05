import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Layout } from 'antd'
import { V2V3SettingsPageKey } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import Link from 'next/link'
import { useMemo } from 'react'
import { twJoin } from 'tailwind-merge'
import { featureFlagEnabled } from 'utils/featureFlags'
import { ProjectSettingsLayout } from './ProjectSettingsLayout'
import { useSettingsPagePath } from './hooks/useSettingsPagePath'
import { ArchiveProjectSettingsPage } from './pages/ArchiveProjectSettingsPage'
import { EditNftsPage } from './pages/EditNftsPage'
import { GovernanceSettingsPage } from './pages/GovernanceSettingsPage'
import { EditCyclePage } from './pages/NewEditCyclePage/EditCyclePage'
import { PayoutsSettingsPage } from './pages/PayoutsSettingsPage'
import { ProjectDetailsSettingsPage } from './pages/ProjectDetailsSettingsPage/ProjectDetailsSettingsPage'
import { ProjectHandleSettingsPage } from './pages/ProjectHandleSettingsPage'
import { ProjectNftSettingsPage } from './pages/ProjectNftSettingsPage'
import { ProjectUpgradesPage } from './pages/ProjectUpgradesPage'
import { ReconfigureFundingCycleSettingsPage } from './pages/ReconfigureFundingCycleSettingsPage'
import { ReservedTokensSettingsPage } from './pages/ReservedTokensSettingsPage'
import { TransferOwnershipSettingsPage } from './pages/TransferOwnershipSettingsPage'
import { V1V2TokenMigrationSettingsPage } from './pages/V1V2TokenMigrationSettingsPage'

const SettingsPageComponents: {
  [k in V2V3SettingsPageKey]: () => JSX.Element | null
} = {
  general: ProjectDetailsSettingsPage,
  handle: ProjectHandleSettingsPage,
  cycle: featureFlagEnabled(FEATURE_FLAGS.NEW_CYCLE_CONFIG_PAGE)
    ? EditCyclePage
    : ReconfigureFundingCycleSettingsPage,
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

const V2V3SettingsPageKeyTitleMap = (): {
  [k in V2V3SettingsPageKey]: string
} => ({
  general: t`General`,
  handle: t`Project handle`,
  cycle: t`Cycle configuration`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved token recipients`,
  nfts: t`Edit NFT collection`,
  tokenmigration: t`Token migration`,
  transferownership: t`Transfer ownership`,
  archiveproject: t`Archive project`,
  governance: t`Governance`,
  upgrades: t`Project upgrades`,
  projectnft: t`Project NFT theme`,
})

function Breadcrumbs({
  pageTitle,
  settingsPageKey,
  className,
}: {
  pageTitle: string
  settingsPageKey: V2V3SettingsPageKey
  className: string
}) {
  return (
    <ul className={twJoin('flex items-center gap-2 text-sm', className)}>
      <li>
        <Link
          href={useSettingsPagePath()}
          className="text-secondary flex items-center gap-2 font-medium"
        >
          <Trans>Manage</Trans>
        </Link>
      </li>

      <ChevronRightIcon className="text-tertiary h-5 w-5" />

      <li>
        <Link
          href={useSettingsPagePath(settingsPageKey)}
          className="font-medium"
        >
          <Trans>{pageTitle}</Trans>
        </Link>
      </li>
    </ul>
  )
}

export function ProjectSettingsContent({
  settingsPageKey,
}: {
  settingsPageKey: V2V3SettingsPageKey
}) {
  const ActiveSettingsPage = useMemo(
    () => SettingsPageComponents[settingsPageKey],
    [settingsPageKey],
  )

  const pageTitle = V2V3SettingsPageKeyTitleMap()[settingsPageKey]

  return (
    <ProjectSettingsLayout>
      <Breadcrumbs
        pageTitle={pageTitle}
        className="mb-7"
        settingsPageKey={settingsPageKey}
      />
      <Link href={useSettingsPagePath()}>
        <Button type="default" className="mb-7 px-3" size="small">
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
      </Link>

      <h2 className="mb-4 font-heading text-2xl font-medium text-black dark:text-slate-100">
        {pageTitle}
      </h2>

      <Layout.Content className="my-0">
        <ActiveSettingsPage />
      </Layout.Content>
    </ProjectSettingsLayout>
  )
}
