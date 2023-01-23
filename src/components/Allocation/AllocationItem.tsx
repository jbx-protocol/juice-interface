import { Col, Divider, Row, Space } from 'antd'
import useMobile from 'hooks/Mobile'
import { ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export const AllocationItem = ({
  className,
  title,
  amount,
  extra,
  onClick,
}: {
  className?: string
  title: ReactNode
  amount: ReactNode
  extra?: ReactNode
  onClick?: VoidFunction
}) => {
  const isMobile = useMobile()
  const isClickable = !!onClick

  // TOOD: Remove border-solid once tailwind preflight is enabled
  const containerClasses = classNames(
    'select-none border border-solid border-smoke-200 dark:border-slate-300 bg-smoke-75 dark:bg-slate-400',
    isClickable
      ? 'cursor-pointer transition-colors hover:border-smoke-400 dark:hover:border-slate-100'
      : '',
  )

  if (isMobile) {
    return (
      <div className={classNames(containerClasses, 'py-4')} onClick={onClick}>
        <div className="flex justify-between pr-3 pl-7">
          <div>{title}</div>
          {extra}
        </div>
        <Divider className="m-0 my-3" />
        <div className="pr-3 pl-7">{amount}</div>
      </div>
    )
  }

  return (
    <Row className={classNames(containerClasses, className)} onClick={onClick}>
      <Col
        span={13}
        className="border-0 border-r-[1px] border-solid border-smoke-200 py-3 pl-7  dark:border-slate-300"
      >
        {title}
      </Col>
      <Col span={11} className="py-3 pr-4 text-end">
        <Space size="large">
          {amount}
          {extra}
        </Space>
      </Col>
    </Row>
  )
}
