import { DownOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import * as styleColors from 'constants/styles/colors'
import { CreateCollapsePanel } from './CreateCollapsePanel'

export const CreateCollapse: React.FC<{
  defaultActiveKey?: number
  accordion?: boolean
}> & {
  Panel: typeof CreateCollapsePanel
} = ({ defaultActiveKey, accordion, children }) => {
  return (
    <Collapse
      accordion={accordion}
      defaultActiveKey={defaultActiveKey}
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
    >
      {children}
    </Collapse>
  )
}

CreateCollapse.Panel = CreateCollapsePanel
