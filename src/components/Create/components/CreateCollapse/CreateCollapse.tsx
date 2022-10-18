import { DownOutlined } from '@ant-design/icons'
import { Collapse, CollapsePanelProps, Divider } from 'antd'

export const CreateCollapse: React.FC & { Panel: typeof Collapse.Panel } = ({
  children,
}) => {
  return (
    <Collapse
      className="create-collapse"
      expandIconPosition="end"
      bordered={false}
      ghost
      expandIcon={({ isActive }) => (
        <DownOutlined rotate={isActive ? 180 : 0} />
      )}
    >
      {children}
    </Collapse>
  )
}

const OverridenPanel: React.FC<CollapsePanelProps> = props => {
  return (
    <Collapse.Panel {...props}>
      {
        <>
          {props.children}
          <Divider style={{ marginBottom: '0' }} />
        </>
      }
    </Collapse.Panel>
  )
}

CreateCollapse.Panel = OverridenPanel
