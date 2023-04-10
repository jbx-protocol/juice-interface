import { FilterOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Collapse, Select } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { useEffect, useState } from 'react'
import { classNames } from 'utils/classNames'
import FilterCheckboxItem from './FilterCheckboxItem'

type OrderByOption =
  | 'createdAt'
  | 'totalPaid'
  | 'currentBalance'
  | 'paymentsCount'

export type CheckboxOnChange = (checked: boolean) => void

export default function ProjectsFilterAndSort({
  includeV1,
  setIncludeV1,
  includeV2,
  setIncludeV2,
  showArchived,
  setShowArchived,
  reversed,
  setReversed,
  orderBy,
  setOrderBy,
}: {
  includeV1: boolean
  setIncludeV1: CheckboxOnChange
  includeV2: boolean
  setIncludeV2: CheckboxOnChange
  showArchived: boolean
  setShowArchived: CheckboxOnChange
  reversed: boolean
  setReversed: CheckboxOnChange
  orderBy: OrderByOption
  setOrderBy: (value: OrderByOption) => void
}) {
  const [activeKey, setActiveKey] = useState<0 | undefined>()

  // Close collapse when clicking anywhere in the window except the collapse items
  useEffect(() => {
    function handleClick() {
      setActiveKey(undefined)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="flex max-w-[100vw] flex-wrap items-center whitespace-pre">
      <Collapse
        className={classNames(
          `projects-filter-collapse`,
          'my-0 mr-4 border-none bg-transparent',
        )}
        activeKey={activeKey}
      >
        <CollapsePanel
          className="border-none"
          key={0}
          showArrow={false}
          header={
            <span
              className="text-grey-500 dark:text-grey-300"
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              <span className="flex items-center gap-1">
                <FilterOutlined />{' '}
                <label className="cursor-pointer">Filter</label>
              </span>
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
              label={t`V2`}
              checked={includeV2}
              onChange={setIncludeV2}
            />
            <FilterCheckboxItem
              label={t`Archived`}
              checked={showArchived}
              onChange={setShowArchived}
            />
            <FilterCheckboxItem
              label={t`Reverse`}
              checked={reversed}
              onChange={setReversed}
            />
          </div>
        </CollapsePanel>
      </Collapse>

      <Select className="my-2 w-44" value={orderBy} onChange={setOrderBy}>
        <Select.Option value="totalPaid">
          <Trans>Total raised</Trans>
        </Select.Option>
        <Select.Option value="createdAt">
          <Trans>Date created</Trans>
        </Select.Option>
        <Select.Option value="currentBalance">
          <Trans>Current balance</Trans>
        </Select.Option>
        <Select.Option value="paymentsCount">
          <Trans>Payments</Trans>
        </Select.Option>
      </Select>
    </div>
  )
}
