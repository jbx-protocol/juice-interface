import { t, Trans } from '@lingui/macro'
import { Collapse, Select } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { CSSProperties, useContext, useState } from 'react'

import { FilterOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'

import FilterCheckboxItem from './FilterCheckboxItem'

type OrderByOption = 'createdAt' | 'totalPaid'

export default function ProjectsFilterAndSort({
  includeV1,
  setIncludeV1,
  includeV1_1,
  setIncludeV1_1,
  includeActive,
  setIncludeActive,
  includeArchived,
  setIncludeArchived,
  orderBy,
  setOrderBy,
}: {
  includeV1: boolean
  setIncludeV1: Function
  includeV1_1: boolean
  setIncludeV1_1: Function
  includeActive: boolean
  setIncludeActive: Function
  includeArchived: boolean
  setIncludeArchived: Function
  orderBy: OrderByOption
  setOrderBy: any
}) {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const filterCollapseStyle: CSSProperties = {
    border: 'none',
    marginTop: 0,
    marginBottom: 0,
    marginRight: 15,
  }

  // If includeArchived is true, we set active back to true
  // to avoid both being unselected
  const toggleArchived = () => {
    setIncludeActive(includeArchived)
    setIncludeArchived(!includeArchived)
  }

  // Close collapse when clicking anywhere in the window except the collapse items
  window.addEventListener('click', () => setActiveKey(undefined), false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'pre',
        flexWrap: 'wrap',
        maxWidth: '100vw',
      }}
    >
      <Collapse
        className={`projects-filter-collapse ${isDarkMode ? 'dark' : ''}`}
        style={filterCollapseStyle}
        activeKey={activeKey}
      >
        <CollapsePanel
          style={{
            border: 'none',
          }}
          key={0}
          showArrow={false}
          header={
            <span
              style={{ color: colors.text.secondary }}
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              <FilterOutlined /> <label>Filter</label>
            </span>
          }
        >
          {/* onClick: Do not close collapse when clicking its items*/}
          <div onClick={e => e.stopPropagation()}>
            <FilterCheckboxItem
              label={t`V1`}
              checked={includeV1}
              onChange={setIncludeV1}
            />
            <FilterCheckboxItem
              label={t`V1.1`}
              checked={includeV1_1}
              onChange={setIncludeV1_1}
            />
            <FilterCheckboxItem
              label={t`Archived`}
              checked={includeArchived}
              onChange={toggleArchived}
            />
          </div>
        </CollapsePanel>
      </Collapse>

      <Select
        value={orderBy}
        onChange={setOrderBy}
        style={{
          width: 180,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Select.Option value="totalPaid">
          <Trans>Total raised</Trans>
        </Select.Option>
        <Select.Option value="createdAt">
          <Trans>Date created</Trans>
        </Select.Option>
      </Select>
    </div>
  )
}
