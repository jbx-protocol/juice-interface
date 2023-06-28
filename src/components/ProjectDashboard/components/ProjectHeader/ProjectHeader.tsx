import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import BookmarkButton from 'components/BookmarkButton/BookmarkButton'
import EthereumAddress from 'components/EthereumAddress'
import { useProjectHeader } from 'components/ProjectDashboard/hooks'
import { SubscribeButton } from 'components/SubscribeButton'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { PV_V2 } from 'constants/pv'
import useMobile from 'hooks/useMobile'
import { useV2V3WalletHasPermission } from 'hooks/v2v3/contractReader/useV2V3WalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { settingsPagePath } from 'utils/routes'
import { ProjectHeaderLogo } from './components/ProjectHeaderLogo'
import { ProjectHeaderPopupMenu } from './components/ProjectHeaderPopupMenu'
import { ProjectHeaderStats } from './components/ProjectHeaderStats'
import { Subtitle } from './components/Subtitle'

export const ProjectHeader = ({ className }: { className?: string }) => {
  const { title, subtitle, projectId, handle, owner } = useProjectHeader()
  const isMobile = useMobile()
  const canReconfigure = useV2V3WalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )

  return (
    <div className={twMerge('relative flex w-full flex-col', className)}>
      <ProjectHeaderLogo className="absolute left-0 -top-[146px] rounded-[0.85rem] border-6 border-white dark:border-slate-900" />

      <div className="flex justify-end gap-4">
        {projectId ? (
          isMobile ? (
            <ProjectHeaderPopupMenu projectId={projectId} />
          ) : (
            <>
              <SubscribeButton projectId={projectId} />
              <BookmarkButton
                projectId={projectId}
                pv={PV_V2}
                tooltipPlacement="bottom"
              />
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
        <h1 className="mb-0 font-heading text-3xl font-medium dark:text-slate-50 md:text-4xl">
          {title}
        </h1>

        <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-12">
          <div className="flex min-w-0 flex-col gap-3">
            {subtitle && <Subtitle subtitle={subtitle} />}
            <div className="text-grey-500 dark:text-slate-200">
              {projectId ? (
                <V2V3ProjectHandleLink
                  className="text-grey-500 dark:text-slate-200"
                  handle={handle}
                  projectId={projectId}
                />
              ) : null}

              <Divider className="mx-4" type="vertical" />

              <span>
                <Trans>
                  Owned by: <EthereumAddress address={owner} />
                </Trans>
              </span>
            </div>
          </div>

          <ProjectHeaderStats />
        </div>
      </div>
    </div>
  )
}
