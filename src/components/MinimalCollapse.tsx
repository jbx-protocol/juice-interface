import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { PropsWithChildren } from 'react'

export function MinimalCollapse({
  children,
  header,
}: PropsWithChildren<{ header: string | JSX.Element }>) {
  return (
    <Collapse
      bordered={false}
      ghost
      style={{
        background: 'transparent',
      }}
      className="minimal ant-collapse-header-text-primary ant-collapse-header-p-0"
    >
      <CollapsePanel key="1" header={header}>
        {children}
      </CollapsePanel>
    </Collapse>
  )
}
