import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

function ListItemValue({ value }: { value: string | JSX.Element }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div
      style={{
        color: colors.text.secondary,
        whiteSpace: 'nowrap',
        marginLeft: '6px',
      }}
    >
      {value}
    </div>
  )
}

// e.g. 'Distribution limit', 'Start', 'End', etc.
export function FundingCycleListItem({
  name,
  helperText,
  value,
  subItem,
}: {
  name: string
  value: string | JSX.Element
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

        <ListItemValue value={value} />
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={{ fontWeight: 500 }}>{name}:</div>{' '}
      <ListItemValue value={value} />
    </div>
  )
}
