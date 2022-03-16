import { CSSProperties } from 'react'

export const topNavStyles: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'var(--background-l0)',
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

export const mobileNavSubsectionStyles: CSSProperties = {
  paddingLeft: 15,
  height: 110,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}

export const navDropdownItem: CSSProperties = {
  color: 'var(--text-primary)',
  fontWeight: 500,
}
