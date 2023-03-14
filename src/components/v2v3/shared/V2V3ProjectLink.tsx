import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { v2v3ProjectRoute } from 'utils/routes'
import { AllocatorBadge } from './FundingCycleConfigurationDrawers/AllocatorBadge'

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
    <Space size="small">
      <Link href={v2v3ProjectRoute({ projectId })}>
        <a
          className={twMerge(
            'select-all leading-[22px] text-grey-900 hover:text-bluebs-500 hover:underline dark:text-slate-100',
            className,
          )}
        >
          <Trans>Project #{projectId}</Trans>
        </a>
      </Link>
      {allocator && <AllocatorBadge allocator={allocator} />}
    </Space>
  )
}
