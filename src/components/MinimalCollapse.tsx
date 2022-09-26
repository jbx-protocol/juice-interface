import { Collapse, CollapseProps } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { CSSProperties, PropsWithChildren } from 'react'

export function MinimalCollapse({
  children,
  header,
  style,
  light,
  ...props
}: PropsWithChildren<{
  header: string | JSX.Element
  style?: CSSProperties
  light?: boolean
}> &
  CollapseProps) {
  return (
    <Collapse
      bordered={false}
      ghost
      style={{
        background: 'transparent',
        ...style,
      }}
      className={`minimal ant-collapse-header-text-primary ant-collapse-header-p-0 ${
        light ? 'light' : ''
      }`}
      {...props}
    >
      <CollapsePanel key="1" header={header}>
        <div style={{ paddingLeft: '1.5rem' }}>{children}</div>
      </CollapsePanel>
    </Collapse>
  )
}
