import { DownOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { CreateCollapsePanel } from './CreateCollapsePanel'

export const CreateCollapse: React.FC<
  React.PropsWithChildren<{
    activeKey?: string | number | (string | number)[]
    onChange?: (key: string | string[]) => void
  }>
> & {
  Panel: typeof CreateCollapsePanel
} = ({ activeKey, onChange, children }) => {
  return (
    <Collapse
      className="create-collapse" // ant override
      expandIconPosition="end"
      bordered={false}
      ghost
      expandIcon={({ isActive }) => (
        <DownOutlined className="text-grey-500" rotate={isActive ? 180 : 0} />
      )}
      onChange={onChange}
      {...(activeKey ? { activeKey } : {})}
    >
      {children}
    </Collapse>
  )
}

CreateCollapse.Panel = CreateCollapsePanel
