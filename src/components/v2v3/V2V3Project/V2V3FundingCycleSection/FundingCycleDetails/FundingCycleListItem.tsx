import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

// e.g. 'Distribution limit', 'Start', 'End', etc.
export function FundingCycleListItem({
  name,
  value,
  helperText,
  subItem,
}: {
  name: string
  value: string | JSX.Element
  helperText?: string | JSX.Element
  subItem?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  function ListItemValue() {
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

  const containerStyle: CSSProperties = {
    paddingTop: '3px',
    paddingBottom: '4px',
    fontSize: subItem ? '0.6rem' : '0.8rem',
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: subItem ? '20px' : 'unset',
  }
  if (helperText) {
    return (
      <div style={{ ...containerStyle, cursor: 'default' }}>
        <Tooltip title={helperText}>
          <div style={{ fontWeight: 500, display: 'flex' }}>
            <div
              className={'dashed-underline'}
              style={{ height: subItem ? '1rem' : '1.2rem' }}
            >
              {name}
            </div>
            :
          </div>{' '}
        </Tooltip>
        <ListItemValue />
      </div>
    )
  }
  return (
    <div style={containerStyle}>
      <div style={{ fontWeight: 500 }}>{name}:</div> <ListItemValue />
    </div>
  )
}
