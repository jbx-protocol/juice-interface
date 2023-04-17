import { FilterOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Collapse, Select } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { useTagCounts } from 'hooks/TagCounts'
import { DBProjectQueryOpts } from 'models/dbProject'
import { ProjectTagName, projectTagOptions } from 'models/project-tags'
import { useEffect, useState } from 'react'
import { classNames } from 'utils/classNames'
import FilterCheckboxItem from './FilterCheckboxItem'

type OrderByOption = DBProjectQueryOpts['orderBy']

export type CheckboxOnChange = (checked: boolean) => void

export default function ProjectsFilterAndSort({
  includeV1,
  setIncludeV1,
  includeV2,
  setIncludeV2,
  showArchived,
  setShowArchived,
  searchTags,
  setSearchTags,
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
  searchTags: ProjectTagName[]
  setSearchTags: (tags: ProjectTagName[]) => void
  reversed: boolean
  setReversed: CheckboxOnChange
  orderBy: OrderByOption
  setOrderBy: (value: OrderByOption) => void
}) {
  const [tagsIsOpen, setTagsIsOpen] = useState<boolean>(false)
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false)

  // Close collapse when clicking anywhere in the window except the collapse items
  useEffect(() => {
    function handleClick() {
      setTagsIsOpen(false)
      setFilterIsOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const { data: tagCounts } = useTagCounts()

  return (
    <div className="flex max-w-[100vw] flex-wrap items-center whitespace-pre">
      <Collapse
        className={classNames(
          `projects-filter-collapse`,
          'my-0 border-none bg-transparent',
        )}
        activeKey={tagsIsOpen ? 0 : undefined}
      >
        <CollapsePanel
          className="border-none"
          key={0}
          showArrow={false}
          header={
            <span
              className="text-grey-500 dark:text-grey-300"
              onClick={e => {
                setTagsIsOpen(x => !x)
                e.stopPropagation()
              }}
            >
              <label className="cursor-pointer">
                Tags
                {searchTags.length ? (
                  <span className="ml-1 inline-block h-5 w-5 rounded-full bg-grey-200 text-center text-grey-600 dark:bg-grey-300 dark:text-grey-800">
                    {searchTags.length}
                  </span>
                ) : null}
              </label>
            </span>
          }
        >
          {/* onClick: Do not close collapse when clicking its items*/}
          <div onClick={e => e.stopPropagation()}>
            {searchTags.length > 0 && (
              <FilterCheckboxItem
                label={t`Deselect all`}
                checked={null}
                onChange={() => setSearchTags([])}
              />
            )}
            {projectTagOptions.map(t => (
              <FilterCheckboxItem
                key={t}
                label={`${t}${
                  tagCounts && tagCounts[t] ? ` (${tagCounts[t]})` : ''
                }`}
                checked={searchTags.includes(t)}
                onChange={() =>
                  setSearchTags(
                    searchTags.includes(t)
                      ? searchTags.filter(_t => _t !== t)
                      : [...searchTags, t],
                  )
                }
              />
            ))}
          </div>
        </CollapsePanel>
      </Collapse>

      <Collapse
        className={classNames(
          `projects-filter-collapse`,
          'my-0 ml-4 border-none bg-transparent',
        )}
        activeKey={filterIsOpen ? 0 : undefined}
      >
        <CollapsePanel
          className="border-none"
          key={0}
          showArrow={false}
          header={
            <span
              className="text-grey-500 dark:text-grey-300"
              onClick={e => {
                setFilterIsOpen(x => !x)
                e.stopPropagation()
              }}
            >
              <FilterOutlined />{' '}
              <label className="cursor-pointer">Filter</label>
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

      <Select className="my-2 ml-4 w-44" value={orderBy} onChange={setOrderBy}>
        <Select.Option value="total_paid">
          <Trans>Total raised</Trans>
        </Select.Option>
        <Select.Option value="created_at">
          <Trans>Date created</Trans>
        </Select.Option>
        <Select.Option value="current_balance">
          <Trans>Current balance</Trans>
        </Select.Option>
        <Select.Option value="payments_count">
          <Trans>Payments</Trans>
        </Select.Option>
      </Select>
    </div>
  )
}
