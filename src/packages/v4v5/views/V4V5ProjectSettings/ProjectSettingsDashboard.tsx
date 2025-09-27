import {
  NativeTokenValue,
  useJBChainId,
  useJBContractContext,
  useJBProjectMetadataContext,
} from 'juice-sdk-react'

import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import Loading from 'components/Loading'
import Link from 'next/link'
import { useV4V5NftRewards } from 'packages/v4v5/contexts/V4V5NftRewards/V4V5NftRewardsProvider'
import { useProjectHasErc20Token } from 'packages/v4v5/hooks/useProjectHasErc20Token'
import { useV4V5BalanceOfNativeTerminal } from 'packages/v4v5/hooks/useV4V5BalanceOfNativeTerminal'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import { useV4V5WalletHasPermission } from 'packages/v4v5/hooks/useV4V5WalletHasPermission'
import { V4V5OperatorPermission } from 'packages/v4v5/models/v4Permissions'
import { useV4V5DistributableAmount } from '../V4V5ProjectDashboard/V4V5ProjectTabs/V4V5CyclesPayoutsPanel/hooks/useV4V5DistributableAmount'
import { useSettingsPagePath } from './hooks/useSettingsPagePath'
import { ProjectSettingsLayout } from './ProjectSettingsLayout'

export type SettingsPageKey =
  | 'general'
  // | 'handle' -> commenting out not necessary for v4
  | 'cycle'
  | 'nfts'
  | 'payouts'
  // | 'reservedtokens'
  | 'transferownership'
  | 'archiveproject'
  // | 'heldfees'
  | 'createerc20'

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
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()

  const { nftRewards } = useV4V5NftRewards()

  const { projectId } = useJBContractContext()
  const { metadata } = useJBProjectMetadataContext()

  const chainId = useJBChainId()

  const { data: balance, isLoading: loading } = useV4V5BalanceOfNativeTerminal({
    chainId,
    projectId,
  })
  const { distributableAmount } = useV4V5DistributableAmount({
    chainId,
    projectId,
  })

  const projectHasErc20Token = useProjectHasErc20Token()
  const hasIssueTicketsPermission = useV4V5WalletHasPermission(
    V4V5OperatorPermission.MINT_TOKENS,
  )

  const projectMetadata = metadata?.data

  const canCreateErc20Token = !projectHasErc20Token && hasIssueTicketsPermission

  const erc20Path = useSettingsPagePath('createerc20')

  const nftsPath = useSettingsPagePath('nfts') ?? ''

  return (
    <ProjectSettingsLayout>
      <section className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        <SettingsCard>
          {projectMetadata ? (
            <div className="flex justify-between gap-8">
              <div>
                <div className="mb-1">
                  <div className="text-xl font-medium">
                    {projectMetadata.name}
                  </div>
                  <div className="text-tertiary">
                    <>Project #{projectId.toString()}</>
                  </div>
                </div>

                <span className="text-secondary">
                  <Trans>
                    Owned by:{' '}
                    <EthereumAddress
                      address={projectOwnerAddress}
                      chainId={chainId}
                    />
                  </Trans>
                </span>
              </div>
              <div className="shrink-0">
                <div className="mb-1  font-medium">
                  <Trans>Project balance</Trans>
                </div>
                <div className="text-xl">
                  <NativeTokenValue wei={balance ?? 0n} />
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
                <Trans>Available payout</Trans>
              </div>
              <div className="text-xl">
                {!loading ? (
                  <NativeTokenValue wei={distributableAmount.value} />
                ) : (
                  <Loading />
                )}
              </div>
            </div>
            <Link href={`${useSettingsPagePath('cycle')}?section=payouts`}>
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
                <Link href={useSettingsPagePath('general') ?? ''}>
                  <Trans>Basic details</Trans>
                </Link>
              </li>
              <li>
                <Link href={useSettingsPagePath('archiveproject') ?? ''}>
                  <Trans>Archive</Trans>
                </Link>
              </li>
              {/* <li>
                <Link href={useSettingsPagePath('handle')}>
                  <Trans>Project handle</Trans>
                </Link>
              </li> */}
            </ul>
          </SettingsGroupCard>

          <SettingsGroupCard
            title={<Trans>Ruleset configuration</Trans>}
            subtitle={
              <Trans>Make changes to your ruleset settings and rules</Trans>
            }
          >
            <Link href={useSettingsPagePath('cycle') ?? ''}>
              <Trans>Edit next ruleset</Trans>
            </Link>
          </SettingsGroupCard>
          {nftRewards.rewardTiers?.length ? 
            <SettingsGroupCard
              title={<Trans>NFTs & Rewards</Trans>}
              subtitle={<Trans>Manage your project's NFTs and rewards</Trans>}
            >
              <ul>
                <li>
                  <Link href={nftsPath ?? ''}>
                    <Trans>NFTs</Trans>
                  </Link>
                </li>
              </ul>
            </SettingsGroupCard>
          : null}
          {canCreateErc20Token && (
            <SettingsGroupCard
              title={<Trans>Tools</Trans>}
              subtitle={
                <Trans>Extended functionality for project owners</Trans>
              }
            >
              <ul>
                {/* {canCreateErc20Token && ( */}
                <li>
                  <Link href={erc20Path ?? ''}>
                    <Trans>Create ERC-20 Token</Trans>
                  </Link>
                </li>
                {/* )} */}
                {/* <li>
                  <Link href={useSettingsPagePath('heldfees')}>
                    <Trans>Process held fees</Trans>
                  </Link>
                </li> */}
              </ul>
            </SettingsGroupCard>
          )}
          <SettingsGroupCard
            title={<Trans>Manage</Trans>}
            subtitle={<Trans>Manage your project's state and ownership</Trans>}
          >
            <ul>
              <li>
                <Link href={useSettingsPagePath('transferownership') ?? ''}>
                  <Trans>Transfer ownership</Trans>
                </Link>
              </li>
            </ul>
          </SettingsGroupCard>
        </div>
      </section>
    </ProjectSettingsLayout>
  )
}

export default ProjectSettingsDashboard
