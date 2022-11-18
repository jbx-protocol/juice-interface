import { CSSProperties } from 'react'

import { padding } from './padding'

export const LAYOUT_MAX_WIDTH_PX = 1080

export const layouts: Record<string, CSSProperties> = {
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxWidth: {
    maxWidth: LAYOUT_MAX_WIDTH_PX,
    margin: '0 auto',
    padding: padding.app,
  },
}
