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
  return (
    <div
      style={{
        ...shadowCard,
        padding: 20,
        background: colors.backgroundTertiary,
        ...style,
      }}
    >
      <h3>WTF</h3>
      {children}
    </div>
  )
}
