import { Divider } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

// e.g. 'Funding cycle', 'Token', 'Rules' sections
export function FundingCycleDetailsRow({
  header,
  items,
  style,
}: {
  header: string
  items: JSX.Element
  style?: CSSProperties
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ paddingBottom: '1.1rem', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h4
          style={{
            color: colors.text.secondary,
            fontSize: '0.8rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            paddingRight: '10px',
            textTransform: 'uppercase',
          }}
        >
          {header}
        </h4>
        <Divider style={{ margin: '2px 0 10px', minWidth: 'unset' }} />
      </div>
      <div>{items}</div>
    </div>
  )
}
