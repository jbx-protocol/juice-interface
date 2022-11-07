import { DownOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import * as styleColors from 'constants/styles/colors'
import { CreateCollapsePanel } from './CreateCollapsePanel'

export const CreateCollapse: React.FC<{
  activeKey?: string | number | (string | number)[]
  onChange?: (key: string | string[]) => void
}> & {
  Panel: typeof CreateCollapsePanel
} = ({ activeKey, onChange, children }) => {
  return (
    <Collapse
      className="create-collapse"
      expandIconPosition="end"
      bordered={false}
      ghost
      expandIcon={({ isActive }) => (
        <DownOutlined
          rotate={isActive ? 180 : 0}
          style={{ color: styleColors.lightColors.gray500 }}
        />
      )}
      onChange={onChange}
      {...(activeKey ? { activeKey } : {})}
    >
      {children}
    </Collapse>
  )
}

CreateCollapse.Panel = CreateCollapsePanel
