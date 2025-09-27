import { Trans } from '@lingui/macro'
import ProjectLogo from 'components/ProjectLogo'
import { PV_V4 } from 'constants/pv'
import { JBChainId } from 'juice-sdk-react'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { getChainName } from '../utils/networks'
import { v4ProjectRoute } from '../utils/routes'
import { ChainLogo } from './ChainLogo'

/**
 * Renders a link to a V4 project
 */
export default function V4ProjectHandleLink({
  className,
  containerClassName,
  name,
  projectId,
  withProjectAvatar = false,
  chainId,
}: {
  className?: string
  containerClassName?: string
  name?: string | null
  projectId: number
  withProjectAvatar?: boolean
  chainId: number | JBChainId
}) {
  const chainName = getChainName(chainId)

  return (
    <div
      className={twMerge('inline-flex items-center gap-3', containerClassName)}
    >
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
        href={v4ProjectRoute({ projectId, chainId })}
        as={v4ProjectRoute({ projectId, chainId })}
        className={twMerge(
          'select-all font-medium capitalize leading-[22px] text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100 flex items-center gap-2',
          className,
        )}
      >
        <ChainLogo chainId={chainId as JBChainId} width={18} height={18} />
        <Trans>Project #{projectId}</Trans>
      </Link>
    </div>
  )
}
