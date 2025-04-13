import { Trans, t } from '@lingui/macro'
import { Button, Layout } from 'antd'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useJBRulesetContext } from 'juice-sdk-react'
import Link from 'next/link'
import { useMemo } from 'react'
import { twJoin } from 'tailwind-merge'
import { isZeroAddress } from 'utils/address'
import { ArchiveProjectSettingsPage } from './ArchiveProjectSettingsPage'
import { CreateErc20TokenSettingsPage } from './CreateErc20TokenSettingsPage'
import { EditCyclePage } from './EditCyclePage/EditCyclePage'
import { EditNftsPage } from './EditNftsPage/EditNftsPage'
import { useSettingsPagePath } from './hooks/useSettingsPagePath'
import { ProjectDetailsSettingsPage } from './ProjectDetailsSettingsPage/ProjectDetailsSettingsPage'
import { SettingsPageKey } from './ProjectSettingsDashboard'
import { ProjectSettingsLayout } from './ProjectSettingsLayout'

const SettingsPageComponents: {
  [k in SettingsPageKey]: () => JSX.Element | null
} = {
  general: ProjectDetailsSettingsPage,
  // handle: () => null, //ProjectHandleSettingsPage,
  cycle: EditCyclePage,
  nfts: EditNftsPage,
  payouts: () => null, //PayoutsSettingsPage,
  // reservedtokens: () => null, //ReservedTokensSettingsPage,
  // transferownership: () => null, //TransferOwnershipSettingsPage,
  archiveproject: ArchiveProjectSettingsPage,
  // heldfees: () => null, //ProcessHeldFeesPage,
  createerc20: CreateErc20TokenSettingsPage,
}

const V4SettingsPageKeyTitleMap = (
  hasExistingNfts: boolean,
): {
  [k in SettingsPageKey]: string
} => ({
  general: t`General`,
  // handle: t`Project handle`,
  cycle: t`Ruleset cycle configuration`,
  payouts: t`Payouts`,
  // reservedtokens: t`Reserved token recipients`,
  nfts: hasExistingNfts ? t`Edit NFT collection` : t`Launch New NFT Collection`,
  // transferownership: t`Transfer ownership`,
  archiveproject: t`Archive project`,
  // heldfees: t`Process held fees`,
  createerc20: t`Create ERC-20 token`,
})

function Breadcrumbs({
  pageTitle,
  settingsPageKey,
  className,
}: {
  pageTitle: string
  settingsPageKey: SettingsPageKey
  className: string
}) {
  return (
    <ul className={twJoin('flex items-center gap-2 text-sm', className)}>
      <li>
        <Link
          href={useSettingsPagePath() ?? ''}
          className="text-secondary flex items-center gap-2 font-medium"
        >
          <Trans>Manage</Trans>
        </Link>
      </li>

      <ChevronRightIcon className="text-tertiary h-5 w-5" />

      <li>
        <Link
          href={useSettingsPagePath(settingsPageKey) ?? ''}
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
  settingsPageKey: SettingsPageKey
}) {
  const { rulesetMetadata } = useJBRulesetContext()

  const ActiveSettingsPage = useMemo(
    () => SettingsPageComponents[settingsPageKey],
    [settingsPageKey],
  )

  const hasExistingNfts = !isZeroAddress(rulesetMetadata?.data?.dataHook)
  const pageTitle = V4SettingsPageKeyTitleMap(hasExistingNfts)[settingsPageKey]

  return (
    <ProjectSettingsLayout>
      <Breadcrumbs
        pageTitle={pageTitle}
        className="mb-7"
        settingsPageKey={settingsPageKey}
      />
      <Link href={useSettingsPagePath() ?? ''}>
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
