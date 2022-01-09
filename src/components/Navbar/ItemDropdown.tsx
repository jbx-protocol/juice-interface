import { useState } from 'react'

import { Collapse, Space } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

export default function ItemDropDown({
  heading,
  dropdownItems,
}: {
  heading: string
  dropdownItems: JSX.Element[]
}) {
  const [activeKey, setActiveKey] = useState<0 | undefined>()
  const iconSize = 12

  return (
    <div className="resources-dropdown">
      <Collapse style={{ border: 'none' }} activeKey={activeKey}>
        <CollapsePanel
          style={{
            border: 'none',
          }}
          key={0}
          showArrow={false}
          header={
            <Space
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              {heading}
              {activeKey === 0 ? (
                <UpOutlined style={{ fontSize: iconSize }} />
              ) : (
                <DownOutlined style={{ fontSize: iconSize }} />
              )}
            </Space>
          }
        >
          {dropdownItems}
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
