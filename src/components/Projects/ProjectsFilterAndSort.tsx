import { Trans } from '@lingui/macro'
import { Collapse, Select } from 'antd'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { CSSProperties, useContext, useState } from 'react'

import { FilterOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'

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

  const filterDropdownItemStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: 40,
  }

  const filterCheckboxItem = (
    label: string,
    checked: boolean,
    onChange: Function,
    disabled?: boolean,
  ) => (
    <div
      style={{
        ...filterDropdownItemStyles,
        color: disabled ? colors.text.tertiary : '',
        cursor: 'pointer',
      }}
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        style={{ marginRight: 10 }}
        checked={checked}
        onChange={() => onChange(!checked)}
        disabled={disabled}
      />
      <Trans>{label}</Trans>
    </div>
  )

  // If includeArchived is true, we set active back to true
  // to avoid both being unselected
  const toggleArchived = () => {
    if (includeArchived) {
      setIncludeActive(true)
    } else {
      setIncludeActive(false)
    }
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
              style={{ color: 'var(--text-secondary)' }}
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
            {filterCheckboxItem('V1', includeV1, setIncludeV1)}
            {filterCheckboxItem('V1.1', includeV1_1, setIncludeV1_1)}
            {filterCheckboxItem('Archived', includeArchived, toggleArchived)}
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
