import { Collapse } from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import React, { CSSProperties } from 'react'

import { colors } from '../constants/styles/colors'
import { shadowCard } from '../constants/styles/shadow-card'
import { ChildElems } from '../models/child-elems'

export default function WtfCard({
  children,
  style,
}: {
  children?: ChildElems
  style?: CSSProperties
}) {
  const collapseStyle: CSSProperties = {
    background: shadowCard.background,
    border: 'none',
  }

  return (
    <div
      style={{
        ...shadowCard,
        padding: 20,
        background: colors.backgroundTertiary,
        ...style,
      }}
    >
      <Collapse style={collapseStyle}>
        <CollapsePanel header="WTF?" key={1} style={{ ...collapseStyle }}>
          <div style={{ background: shadowCard.background }}>{children}</div>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
