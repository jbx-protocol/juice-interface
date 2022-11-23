import { Collapse, CollapseProps } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { PropsWithChildren } from 'react'
import { classNames } from 'utils/classNames'

export function MinimalCollapse({
  className,
  children,
  header,
  light,
  defaultOpen,
  ...props
}: PropsWithChildren<{
  className?: string
  header: string | JSX.Element
  light?: boolean
  defaultOpen?: boolean
}> &
  CollapseProps) {
  return (
    <Collapse
      bordered={false}
      ghost
      className={classNames(
        'minimal ant-collapse-header-text-primary ant-collapse-header-p-0',
        'bg-transparent',
        light ? 'light' : '',
        className,
      )}
      defaultActiveKey={defaultOpen ? ['1'] : []}
      {...props}
    >
      <CollapsePanel key="1" header={header}>
        <div className="pl-6">{children}</div>
      </CollapsePanel>
    </Collapse>
  )
}
