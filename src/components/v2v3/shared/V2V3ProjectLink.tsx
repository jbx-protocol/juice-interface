import { Trans } from '@lingui/macro'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { v2v3ProjectRoute } from 'utils/routes'
import { AllocatorBadge } from '../../AllocatorBadge'

/**
 * Different from V2V3ProjectHandleLink in that it doesn't use the handle. This can be used outside of V2V3ContractsContext and V2V3ProjectContext.
 */
export default function V2V3ProjectLink({
  className,
  projectId,
  allocator,
}: {
  projectId: number
  className?: string
  allocator?: string
}) {
  return (
    <div className="flex gap-2">
      <Link
        href={v2v3ProjectRoute({ projectId })}
        className={twMerge(
          'select-all leading-[22px] text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100',
          className,
        )}
      >
        <Trans>Project #{projectId}</Trans>
      </Link>
      {allocator && <AllocatorBadge allocator={allocator} />}
    </div>
  )
}
