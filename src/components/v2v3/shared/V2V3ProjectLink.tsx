import { Space } from 'antd'
import Link from 'next/link'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { v2v3ProjectRoute } from 'utils/routes'
import { AllocatorBadge } from './FundingCycleConfigurationDrawers/AllocatorBadge'

export default function V2V3ProjectLink({
  className,
  projectId,
  allocator,
}: {
  className?: string
  projectId: number
  allocator?: string
}) {
  return (
    <Space size="small">
      <Link href={v2v3ProjectRoute({ projectId })}>
        <a
          className={twMerge(
            'select-all leading-[22px] text-grey-700 hover:text-haze-400 hover:underline dark:text-slate-100',
            className,
          )}
        >
          Project {projectId}
        </a>
      </Link>
      <AllocatorBadge allocator={allocator} />
    </Space>
  )
}
