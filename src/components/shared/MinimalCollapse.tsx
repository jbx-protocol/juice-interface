import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { CSSProperties, PropsWithChildren } from 'react'

export function MinimalCollapse({
  children,
  header,
  style,
}: PropsWithChildren<{ header: string | JSX.Element; style?: CSSProperties }>) {
  return (
    <Collapse
      bordered={false}
      ghost
      style={{
        background: 'transparent',
        ...style,
      }}
      className="minimal ant-collapse-header-text-primary ant-collapse-header-p-0"
    >
      <CollapsePanel key="1" header={header}>
        {children}
      </CollapsePanel>
    </Collapse>
  )
}
