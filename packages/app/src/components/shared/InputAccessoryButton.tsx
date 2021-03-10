import React from 'react'

import { colors } from '../../constants/styles/colors'

export default function InputAccessoryButton({
  text,
  onClick,
}: {
  text: string | undefined
  onClick?: VoidFunction
}) {
  return text ? (
    <div
      style={{
        cursor: 'pointer',
        color: colors.secondary,
        background: colors.secondaryHint,
        fontWeight: 500,
        padding: '1px 6px',
        marginLeft: 8,
        borderRadius: 4,
      }}
      onClick={onClick}
    >
      {text}
    </div>
  ) : null
}
