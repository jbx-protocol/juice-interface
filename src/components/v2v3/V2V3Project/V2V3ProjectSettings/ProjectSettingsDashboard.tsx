import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import ETHAmount from 'components/currency/ETHAmount'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import Link from 'next/link'
import { useContext } from 'react'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { ProjectSettingsLayout } from './ProjectSettingsLayout'
import { useSettingsPagePath } from './hooks/useSettingsPagePath'

export type MenuKey = V2V3SettingsPageKey

export type V2V3SettingsPageKey =
  | 'general'
  | 'handle'
  | 'cycle'
  | 'nfts'
  | 'payouts'
  | 'reservedtokens'
  | 'transferownership'
  | 'archiveproject'
  | 'governance'
  | 'tokenmigration'
  | 'upgrades'
  | 'projectnft'

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-md border border-solid border-smoke-100 bg-smoke-50 p-7 dark:border-slate-400 dark:bg-slate-700">
      {children}
    </div>
  )
}

function SettingsGroupCard({
  title,
  subtitle,
  children,
}: {
  title: string | JSX.Element
  subtitle: string | JSX.Element
  children: React.ReactNode
}) {
  return (
    <SettingsCard>
      <div className="font-medium">{title}</div>
      <div className="text-secondary mb-2">{subtitle}</div>
      {children}
    </SettingsCard>
  )
}

export function ProjectSettingsDashboard() {
  const {
    projectOwnerAddress,
    handle,
    ETHBalance,
    distributionLimit,
    distributionLimitCurrency,
    loading: { distributionLimitLoading },
  } = useContext(V2V3ProjectContext)
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)

  return (
    <ProjectSettingsLayout>
      <section className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsCard>
          {projectMetadata ? (
            <div className="flex justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl font-medium">
                    {projectMetadata.name}
                  </span>{' '}
                  <span className="text-tertiary">
                    {handle ? `@${handle}` : `#${projectId}`}
                  </span>
                </div>

                <span className="text-secondary">
                  <Trans>
                    Owned by: <EthereumAddress address={projectOwnerAddress} />
                  </Trans>
                </span>
              </div>
              <div>
                <div className="mb-1  font-medium">
                  <Trans>Project balance</Trans>
                </div>
                <div className="text-xl">
                  <ETHAmount amount={ETHBalance} />
                </div>
              </div>
            </div>
          ) : (
            <Loading />
          )}
        </SettingsCard>

        <SettingsCard>
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1  font-medium">
                <Trans>Current payout</Trans>
              </div>
              <div className="text-xl">
                {distributionLimitCurrency && !distributionLimitLoading ? (
                  <AmountInCurrency
                    amount={distributionLimit}
                    currency={V2V3CurrencyName(
                      distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
                    )}
                  />
                ) : (
                  <Loading />
                )}
              </div>
            </div>
            <Link href={useSettingsPagePath('payouts')}>
              <Button type="primary">
                <Trans>Edit payout</Trans>
              </Button>
            </Link>
          </div>
        </SettingsCard>
      </section>

      <section>
        <h2 className="mb-5 font-heading text-xl font-medium">
          <Trans>Project settings</Trans>
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <SettingsGroupCard
            title={<Trans>General</Trans>}
            subtitle={<Trans>Update basic project details</Trans>}
          >
            <ul>
              <li>
                <Link href={useSettingsPagePath('general')}>
                  <Trans>Basic details</Trans>
                </Link>
              </li>
              <li>
                <Link href={useSettingsPagePath('handle')}>
                  <Trans>Project handle</Trans>
                </Link>
              </li>
            </ul>
          </SettingsGroupCard>

          <SettingsGroupCard
            title={<Trans>Cycle configuration</Trans>}
            subtitle={
              <Trans>Make changes to your cycle settings and rules</Trans>
            }
          >
            <Link href={useSettingsPagePath('cycle')}>
              <Trans>Edit next cycle</Trans>
            </Link>
          </SettingsGroupCard>
          <SettingsGroupCard
            title={<Trans>NFTs & Rewards</Trans>}
            subtitle={<Trans>Manage your project's NFTs and rewards</Trans>}
          >
            <ul>
              <li>
                <Link href={useSettingsPagePath('nfts')}>
                  <Trans>NFTs</Trans>
                </Link>
              </li>
            </ul>
          </SettingsGroupCard>
          <SettingsGroupCard
            title={<Trans>Tools</Trans>}
            subtitle={<Trans>Extended functionality for project owners</Trans>}
          >
            <ul>
              <li>
                <Link href={useSettingsPagePath('tokenmigration')}>
                  <Trans>Token migration</Trans>
                </Link>
              </li>
              <li>
                <Link href={useSettingsPagePath('projectnft')}>
                  <Trans>Project NFT theme</Trans>
                </Link>
              </li>
              <li>
                <Link href={useSettingsPagePath('governance')}>
                  <Trans>Governance</Trans>
                </Link>
              </li>
            </ul>
          </SettingsGroupCard>
          <SettingsGroupCard
            title={<Trans>Manage</Trans>}
            subtitle={<Trans>Manage your project's state and ownership</Trans>}
          >
            <ul>
              <li>
                <Link href={useSettingsPagePath('transferownership')}>
                  <Trans>Transfer ownership</Trans>
                </Link>
              </li>
              <li>
                <Link href={useSettingsPagePath('upgrades')}>
                  <Trans>Upgrade</Trans>
                </Link>
              </li>

              <li>
                <Link href={useSettingsPagePath('archiveproject')}>
                  <Trans>Archive</Trans>
                </Link>
              </li>
            </ul>
          </SettingsGroupCard>
        </div>
      </section>
    </ProjectSettingsLayout>
  )
}
