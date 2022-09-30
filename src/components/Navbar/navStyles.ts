import { CSSProperties } from 'react'

export const topNavStyles: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'var(--background-l0)',
  zIndex: 1,
}

export const topRightNavStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
}

export const topLeftNavStyles: CSSProperties = {
  flex: 1,
}

export const navMenuItemStyles: CSSProperties = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 600,
  color: 'var(--text-primary)',
}
