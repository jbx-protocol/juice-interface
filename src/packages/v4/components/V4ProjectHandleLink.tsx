import { Trans } from '@lingui/macro'
import ProjectLogo from 'components/ProjectLogo'
import { PV_V4 } from 'constants/pv'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { v4ProjectRoute } from 'utils/routes'

/**
 * Renders a link to a V4 project
 */
export default function V4ProjectHandleLink({
  className,
  name,
  projectId,
  chainName,
  withProjectAvatar = false,
}: {
  className?: string
  name?: string | null
  chainName: string
  projectId: number
  withProjectAvatar?: boolean
}) {
  return (
    <>
      {withProjectAvatar ? (
        <ProjectLogo
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-grey-300 text-base font-medium uppercase text-grey-600 dark:bg-slate-400 dark:text-slate-100"
          name={name ?? undefined}
          projectId={projectId}
          pv={PV_V4}
        />
      ) : null}
      <Link
        prefetch={false}
        href={v4ProjectRoute({ projectId, chainName })}
        as={v4ProjectRoute({ projectId, chainName })}
        className={twMerge(
          'select-all font-medium leading-[22px] text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100 capitalize',
          className,
        )}
      >
        <Trans>{chainName} Project #{projectId}</Trans>
      </Link>
    </>
  )
}
