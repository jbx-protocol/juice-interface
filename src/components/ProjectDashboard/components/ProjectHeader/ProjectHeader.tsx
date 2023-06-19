import { Divider } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { useProjectHeader } from 'components/ProjectDashboard/hooks'
import { SubscribeButton } from 'components/SubscribeButton'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { twMerge } from 'tailwind-merge'
import { ProjectHeaderLogo } from './components/ProjectHeaderLogo'
import { ProjectHeaderStats } from './components/ProjectHeaderStats'
import { Subtitle } from './components/Subtitle'

export const ProjectHeader = ({ className }: { className?: string }) => {
  const { title, subtitle, projectId, handle, owner } = useProjectHeader()

  return (
    <div className={twMerge('relative flex w-full flex-col gap-4', className)}>
      <ProjectHeaderLogo className="absolute left-0 -top-[146px] rounded-[0.85rem] border-6 border-white dark:border-slate-900" />
      <div className="flex justify-end gap-4">
        {projectId ? <SubscribeButton projectId={projectId} /> : null}

        {/* <BookmarkIcon className="h-6 w-6" /> */}
        {/* <EllipsisVerticalIcon className="h-6 w-6" /> */}
      </div>

      <div>
        <h1 className="mb-0 font-heading text-4xl font-medium dark:text-slate-50">
          {title}
        </h1>
      </div>

      <div className="flex flex-col justify-between gap-8 md:flex-row md:gap-12">
        <div className="flex min-w-0 flex-col gap-7">
          {subtitle && <Subtitle subtitle={subtitle} />}
          <div className="text-grey-500 dark:text-slate-200">
            {projectId ? (
              <V2V3ProjectHandleLink
                className="font-normal text-grey-500 dark:text-slate-200"
                handle={handle}
                projectId={projectId}
              />
            ) : null}
            <Divider className="mx-4" type="vertical" />
            <span>
              Owned by: <EthereumAddress address={owner} />
            </span>
          </div>
        </div>

        <ProjectHeaderStats />
      </div>
    </div>
  )
}
