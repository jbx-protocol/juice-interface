import { Col } from 'antd'
import { ReactNode } from 'react'

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
