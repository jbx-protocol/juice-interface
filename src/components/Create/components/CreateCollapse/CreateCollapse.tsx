import { DownOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'

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

CreateCollapse.Panel = Collapse.Panel
