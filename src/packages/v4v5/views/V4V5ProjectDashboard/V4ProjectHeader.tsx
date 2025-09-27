import { Button, Divider } from 'antd'
import { JBChainId, useJBChainId, useSuckers } from 'juice-sdk-react'
import { settingsPagePath, v4ProjectRoute } from 'packages/v4v5/utils/routes'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'
import EthereumAddress from 'components/EthereumAddress'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import { ProjectHeaderLogo } from 'components/Project/ProjectHeader/ProjectHeaderLogo'
import { SocialLinkButton } from 'components/Project/ProjectHeader/SocialLinkButton'
import { TruncatedText } from 'components/TruncatedText'
import useMobile from 'hooks/useMobile'
import { SuckerPair } from 'juice-sdk-core'
import Link from 'next/link'
import { ChainLogo } from 'packages/v4v5/components/ChainLogo'
import { ProjectHeaderPopupMenu } from 'packages/v4v5/components/ProjectDashboard/components/ProjectHeaderPopupMenu'
import V4ProjectHandleLink from 'packages/v4v5/components/V4ProjectHandleLink'
import { V4OperatorPermission } from 'packages/v4v5/models/v4Permissions'
import { twMerge } from 'tailwind-merge'
import { ProjectHeaderStats } from './ProjectHeaderStats'
// import { Subtitle } from 'components/Project/ProjectHeader/Subtitle'
import { useSocialLinks } from 'components/Project/ProjectHeader/hooks/useSocialLinks'
import { useV4WalletHasPermission } from 'packages/v4v5/hooks/useV4WalletHasPermission'
import { useV4ProjectHeader } from './hooks/useV4ProjectHeader'

export type SocialLink = 'twitter' | 'discord' | 'telegram' | 'website'

export const V4ProjectHeader = ({ className }: { className?: string }) => {
  const socialLinks = useSocialLinks()
  const chainId = useJBChainId()
  const { data: suckers } = useSuckers() as { data: SuckerPair[] }

  const {
    title,
    subtitle,
    projectId,
    owner,
    gnosisSafe,
    archived,
    createdAtSeconds,
  } = useV4ProjectHeader()
  const isMobile = useMobile()

  const canQueueRuleSets = useV4WalletHasPermission(
    V4OperatorPermission.QUEUE_RULESETS,
  )

  const canManageProject = canQueueRuleSets

  // convert createdAtSeconds to date string Month DD, YYYY in local time
  const createdAt = createdAtSeconds
    ? new Date(createdAtSeconds * 1000).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : undefined

  return (
    <div className={twMerge('relative flex w-full flex-col', className)}>
      <ProjectHeaderLogo className="absolute -top-[146px] left-3.5 rounded-[0.85rem] border-6 border-white dark:border-slate-900 md:left-0" />

      <div className="flex items-center justify-end gap-4">
        {projectId ? (
          isMobile ? (
            <ProjectHeaderPopupMenu projectId={projectId} />
          ) : (
            <>
              <div className="flex items-center gap-6">
                {Object.entries(socialLinks)
                  .filter(([, href]) => !!href)
                  .map(([type, href]) => (
                    <SocialLinkButton
                      iconOnly
                      key={type}
                      type={type as SocialLink}
                      href={href ?? ''}
                    />
                  ))}
              </div>
              <ProjectHeaderPopupMenu projectId={projectId} />
              {canManageProject && chainId && (
                <Link
                  href={settingsPagePath({ projectId, chainId }, undefined)}
                  legacyBehavior
                >
                  <Button size="small">
                    <span>
                      <Cog6ToothIcon className="mr-2 inline h-4 w-4" />
                      <Trans>Manage project</Trans>
                    </span>
                  </Button>
                </Link>
              )}
            </>
          )
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-5">
          <h1 className="mb-0 font-heading text-3xl font-medium leading-none dark:text-slate-50 md:text-4xl">
            {title}
          </h1>
          <div className="flex gap-2">
            {suckers?.map(pair => {
              if (!pair || !pair?.peerChainId || !pair?.projectId) return null
              return (
                <Link
                  className="underline"
                  key={pair?.peerChainId}
                  href={`${v4ProjectRoute({
                    chainId: pair?.peerChainId,
                    projectId: Number(pair.projectId),
                  })}`}
                >
                  <ChainLogo
                    chainId={pair.peerChainId as JBChainId}
                    width={18}
                    height={18}
                  />
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex">
          {archived ? <Badge variant="warning">Archived</Badge> : null}
        </div>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-12">
          <div className="flex min-w-0 flex-col gap-3">
            {
              subtitle &&
                (subtitle.type === 'tagline' ? (
                  <TruncatedText
                    className="text-grey-700 dark:text-slate-50 md:text-lg"
                    text={subtitle.text}
                    lines={3}
                  />
                ) : null)
              // <Subtitle subtitle={subtitle.text} />
            }
            <div className="flex flex-col gap-2 text-grey-500 dark:text-slate-200 sm:flex-row sm:items-center">
              {projectId && chainId ? (
                <V4ProjectHandleLink
                  className="text-grey-500 dark:text-slate-200"
                  projectId={projectId}
                  chainId={chainId}
                />
              ) : null}

              {!isMobile && <Divider className="mx-4" type="vertical" />}

              <span className="inline-flex items-center gap-1">
                <Trans>
                  Owned by:{' '}
                  <EthereumAddress address={owner} chainId={chainId} />
                </Trans>
                {gnosisSafe && projectId && chainId && (
                  <GnosisSafeBadge
                    safe={gnosisSafe}
                    href={`${v4ProjectRoute({ projectId, chainId })}/safe`}
                  />
                )}
              </span>
              {createdAt ? (
                <>
                  {!isMobile && <Divider className="mx-4" type="vertical" />}
                  <span>Created {createdAt}</span>
                </>
              ) : null}
            </div>
          </div>

          <ProjectHeaderStats />
        </div>
      </div>
    </div>
  )
}
