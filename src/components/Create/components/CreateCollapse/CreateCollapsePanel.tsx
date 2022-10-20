import { Collapse, CollapsePanelProps, Divider } from 'antd'

export const CreateCollapsePanel: React.FC<
  CollapsePanelProps & { hideDivider?: boolean }
> = props => {
  return (
    <Collapse.Panel {...props}>
      {
        <>
          {props.children}
          {!props.hideDivider && <Divider style={{ marginBottom: '0' }} />}
        </>
      }
    </Collapse.Panel>
  )
}
