import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import { shadowCard } from 'constants/styles/shadowCard'
import { ThemeContext } from 'contexts/themeContext'
import { ChildElems } from 'models/child-elems'
import { CSSProperties, useContext } from 'react'

export default function WtfCard({
  children,
  style,
}: {
  children?: ChildElems
  style?: CSSProperties
}) {
  const theme = useContext(ThemeContext).theme

  const shadowCardStyle = shadowCard(theme)

  const collapseStyle: CSSProperties = {
    background: shadowCardStyle.background,
    border: 'none',
  }

  return (
    <div
      style={{
        ...shadowCard,
        padding: 20,
        background: theme.colors.background.l2,
        ...style,
      }}
    >
      <Collapse style={collapseStyle}>
        <CollapsePanel header="WTF?" key={1} style={{ ...collapseStyle }}>
          <div style={{ background: shadowCardStyle.background }}>
            {children}
          </div>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
