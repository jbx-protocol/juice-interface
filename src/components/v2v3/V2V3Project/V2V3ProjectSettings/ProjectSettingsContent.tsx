import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Trans, t } from '@lingui/macro'
import { Divider, Layout } from 'antd'
import { V2V3SettingsPageKey } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import Link from 'next/link'
import { useMemo } from 'react'
import { twJoin } from 'tailwind-merge'
import { ProjectSettingsLayout } from './ProjectSettingsLayout'
import { useSettingsPagePath } from './hooks/useSettingsPagePath'
import { ArchiveProjectSettingsPage } from './pages/ArchiveProjectSettingsPage'
import { EditNftsPage } from './pages/EditNftsPage'
import { GovernanceSettingsPage } from './pages/GovernanceSettingsPage'
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
  cycle: ReconfigureFundingCycleSettingsPage,
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
  cycle: t`Edit Cycle`,
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
          <ArrowLeftIcon className="text-secondary h-4 w-4" />
          <Trans>Manage</Trans>
        </Link>
      </li>

      <ChevronRightIcon className="text-secondary h-5 w-5" />

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
        className="mb-6"
        settingsPageKey={settingsPageKey}
      />
      <h2 className="mb-0 font-heading text-2xl font-medium text-black dark:text-slate-100">
        {pageTitle}
      </h2>

      <Divider className="mt-3" />

      <Layout.Content className="my-0">
        <ActiveSettingsPage />
      </Layout.Content>
    </ProjectSettingsLayout>
  )
}
