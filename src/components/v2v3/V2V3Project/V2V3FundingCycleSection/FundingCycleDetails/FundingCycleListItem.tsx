import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

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
  const containerStyle: CSSProperties = {
    paddingTop: '3px',
    paddingBottom: '4px',
    fontSize: subItem ? '0.75rem' : '0.875rem',
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: subItem ? '20px' : 'unset',
  }

  const hasDiff = oldValue && value !== oldValue

  const _value = (
    <>
      {hasDiff ? <ListItemValue value={oldValue} diffStatus={'old'} /> : null}
      <ListItemValue value={value} diffStatus={hasDiff ? 'new' : undefined} />
    </>
  )

  if (helperText) {
    return (
      <div style={{ ...containerStyle, cursor: 'default' }}>
        <Tooltip title={helperText} overlayInnerStyle={{ width: '400px' }}>
          <div style={{ fontWeight: 500, display: 'flex' }}>
            <div
              className="text-decoration-underline text-decoration-dashed text-decoration-secondary"
              style={{ height: subItem ? '1rem' : '1.2rem' }}
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
    <div style={containerStyle}>
      <div style={{ fontWeight: 500 }}>{name}:</div> {_value}
    </div>
  )
}
