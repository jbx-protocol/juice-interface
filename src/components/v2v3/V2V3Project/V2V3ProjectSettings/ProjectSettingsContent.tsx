import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Layout } from 'antd'
import { V2V3SettingsPageKey } from 'components/v2v3/V2V3Project/V2V3ProjectSettings/ProjectSettingsDashboard'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import Link from 'next/link'
import { useContext, useMemo } from 'react'
import { twJoin } from 'tailwind-merge'
import { isZeroAddress } from 'utils/address'
import { ProjectSettingsLayout } from './ProjectSettingsLayout'
import { useSettingsPagePath } from './hooks/useSettingsPagePath'
import { ArchiveProjectSettingsPage } from './pages/ArchiveProjectSettingsPage/ArchiveProjectSettingsPage'
import { CreateErc20TokenSettingsPage } from './pages/CreateErc20TokenSettingsPage'
import { EditCyclePage } from './pages/EditCyclePage/EditCyclePage'
import { EditNftsPage } from './pages/EditNftsPage/EditNftsPage'
import { PayoutsSettingsPage } from './pages/PayoutsSettingsPage/PayoutsSettingsPage'
import { ProcessHeldFeesPage } from './pages/ProcessHeldFeesPage/ProcessHeldFeesPage'
import { ProjectDetailsSettingsPage } from './pages/ProjectDetailsSettingsPage/ProjectDetailsSettingsPage'
import { ProjectHandleSettingsPage } from './pages/ProjectHandleSettingsPage'
import { ReservedTokensSettingsPage } from './pages/ReservedTokensSettingsPage/ReservedTokensSettingsPage'
import { TransferOwnershipSettingsPage } from './pages/TransferOwnershipSettingsPage'

const SettingsPageComponents: {
  [k in V2V3SettingsPageKey]: () => JSX.Element | null
} = {
  general: ProjectDetailsSettingsPage,
  handle: ProjectHandleSettingsPage,
  cycle: EditCyclePage,
  nfts: EditNftsPage,
  payouts: PayoutsSettingsPage,
  reservedtokens: ReservedTokensSettingsPage,
  transferownership: TransferOwnershipSettingsPage,
  archiveproject: ArchiveProjectSettingsPage,
  heldfees: ProcessHeldFeesPage,
  createerc20: CreateErc20TokenSettingsPage,
}

const V2V3SettingsPageKeyTitleMap = (
  hasExistingNfts: boolean,
): {
  [k in V2V3SettingsPageKey]: string
} => ({
  general: t`General`,
  handle: t`Project handle`,
  cycle: t`Cycle configuration`,
  payouts: t`Payouts`,
  reservedtokens: t`Reserved token recipients`,
  nfts: hasExistingNfts ? t`Edit NFT collection` : t`Launch New NFT Collection`,
  transferownership: t`Transfer ownership`,
  archiveproject: t`Archive project`,
  heldfees: t`Process held fees`,
  createerc20: t`Create ERC-20 token`,
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
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const hasExistingNfts = !isZeroAddress(fundingCycleMetadata?.dataSource)

  const ActiveSettingsPage = useMemo(
    () => SettingsPageComponents[settingsPageKey],
    [settingsPageKey],
  )

  const pageTitle =
    V2V3SettingsPageKeyTitleMap(hasExistingNfts)[settingsPageKey]

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
