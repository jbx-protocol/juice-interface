import { Col } from 'antd'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

// TODO: Replace all of these usage with `ReviewDescription`, removing row/col
// stuff. See `FundingConfigurationReview for example
export const DescriptionCol = ({
  title,
  desc,
  placeholder = '-',
  span,
  flex,
}: {
  title: ReactNode
  desc: ReactNode
  placeholder?: ReactNode
  span?: number | string
  flex?: number | 'none' | 'auto' | string
}) => {
  return (
    <Col span={span} flex={flex}>
      <div className="flex flex-col gap-2">
        <div
          className={
            'text-xs font-normal uppercase text-grey-600 dark:text-slate-200'
          }
        >
          {title}
        </div>
        <div>{desc ? desc : <i>{placeholder}</i>}</div>
      </div>
    </Col>
  )
}

export const ReviewDescription = ({
  className,
  title,
  desc,
  placeholder = '-',
}: {
  className?: string
  title: ReactNode
  desc: ReactNode
  placeholder?: ReactNode
}) => {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <div
        className={
          'text-xs font-normal uppercase text-grey-600 dark:text-slate-200'
        }
      >
        {title}
      </div>
      <div>{desc ? desc : <i>{placeholder}</i>}</div>
    </div>
  )
}
