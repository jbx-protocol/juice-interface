import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'

// whether this value the old value or a new (updated) value
type DiffStatus = 'new' | 'old'

function ListItemValue({
  value,
  diffStatus,
}: {
  value: string | JSX.Element
  diffStatus?: DiffStatus
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const highlight =
    diffStatus === 'old'
      ? 'bg-error-100 dark:bg-error-900'
      : diffStatus === 'new'
      ? 'bg-success-100 dark:bg-success-900'
      : undefined

  return (
    <div
      style={{
        whiteSpace: 'nowrap',
        paddingRight: diffStatus ? '0.3rem' : 'unset',
      }}
      className={`text-secondary flex ${highlight} ml-2`}
    >
      {diffStatus ? (
        <span style={{ marginRight: '0.5rem' }}>
          {diffStatus === 'new' ? (
            <span style={{ color: colors.text.success }}>+</span>
          ) : diffStatus === 'old' ? (
            <span style={{ color: colors.text.failure }}>–</span>
          ) : null}
        </span>
      ) : null}
      <div style={{ fontWeight: diffStatus ? 500 : 'unset' }}>{value}</div>
    </div>
  )
}

// e.g. 'Distribution limit', 'Start', 'End', etc.
export function FundingCycleListItem({
  name,
  helperText,
  value,
  oldValue,
  subItem,
}: {
  name: string
  value: string | JSX.Element
  oldValue?: string | JSX.Element
  helperText?: string | JSX.Element
  subItem?: boolean
}) {
  const hasDiff = oldValue && value !== oldValue

  const _value = (
    <>
      {hasDiff ? <ListItemValue value={oldValue} diffStatus={'old'} /> : null}
      <ListItemValue value={value} diffStatus={hasDiff ? 'new' : undefined} />
    </>
  )

  if (helperText) {
    return (
      <div
        className={classNames(
          'mb-2 flex cursor-default flex-wrap',
          subItem ? 'ml-5 text-xs' : 'text-sm',
        )}
      >
        <Tooltip title={helperText} overlayInnerStyle={{ width: '400px' }}>
          <div className="flex font-medium">
            <div
              className={classNames(
                'text-decoration-underline text-decoration-dashed text-decoration-secondary',
                subItem ? 'h-4' : '',
              )}
            >
              {name}
            </div>
            :
          </div>{' '}
        </Tooltip>
        {_value}
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'mb-2 flex flex-wrap',
        subItem ? 'ml-5 text-xs' : 'text-sm',
      )}
    >
      <div className="font-medium">{name}:</div> {_value}
    </div>
  )
}
