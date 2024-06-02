import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import { Badge } from 'components/Badge'
import { DomainBadge } from 'components/DomainBadge'
import EthereumAddress from 'components/EthereumAddress'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import { TruncatedText } from 'components/TruncatedText'
import { useProjectHeader } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectHeader'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import useMobile from 'hooks/useMobile'
import { useV2V3WalletHasPermission } from 'hooks/v2v3/contractReader/useV2V3WalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { settingsPagePath, v2v3ProjectRoute } from 'utils/routes'
import { SocialLink } from '../../hooks/useAboutPanel'
import { useSocialLinks } from '../../hooks/useSocialLinks'
import { SocialLinkButton } from '../ui/SocialLinkButton'
import { ProjectHeaderLogo } from './components/ProjectHeaderLogo'
import { ProjectHeaderPopupMenu } from './components/ProjectHeaderPopupMenu'
import { ProjectHeaderStats } from './components/ProjectHeaderStats'
import { Subtitle } from './components/Subtitle'

export const ProjectHeader = ({ className }: { className?: string }) => {
  const socialLinks = useSocialLinks()

  const {
    title,
    subtitle,
    domain,
    projectId,
    handle,
    owner,
    gnosisSafe,
    archived,
    createdAtSeconds,
  } = useProjectHeader()
  const isMobile = useMobile()
  const canReconfigure = useV2V3WalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )

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
              {canReconfigure && (
                <Link
                  href={settingsPagePath(undefined, { handle, projectId })}
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
        <div className="flex items-center gap-3">
          <h1 className="mb-0 font-heading text-3xl font-medium leading-none dark:text-slate-50 md:text-4xl">
            {title}
          </h1>
          <DomainBadge domain={domain} projectId={projectId} />
        </div>
        <div className="flex">
          {archived ? <Badge variant="warning">Archived</Badge> : null}
        </div>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-12">
          <div className="flex min-w-0 flex-col gap-3">
            {subtitle &&
              (subtitle.type === 'tagline' ? (
                <TruncatedText
                  className="text-grey-700 dark:text-slate-50 md:text-lg"
                  text={subtitle.text}
                />
              ) : (
                <Subtitle subtitle={subtitle.text} />
              ))}
            <div className="text-grey-500 dark:text-slate-200">
              {projectId ? (
                <V2V3ProjectHandleLink
                  className="text-grey-500 dark:text-slate-200"
                  handle={handle}
                  projectId={projectId}
                />
              ) : null}

              <Divider className="mx-4" type="vertical" />

              <span className="inline-flex items-center gap-1">
                <Trans>
                  Owned by: <EthereumAddress address={owner} />
                </Trans>
                {gnosisSafe && (
                  <GnosisSafeBadge
                    safe={gnosisSafe}
                    href={`${v2v3ProjectRoute({ projectId })}/safe`}
                  />
                )}
              </span>
              {createdAt ? (
                <>
                  <Divider className="mx-4" type="vertical" />
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
