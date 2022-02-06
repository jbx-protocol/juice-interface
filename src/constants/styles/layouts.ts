import { CSSProperties } from 'react'

import { padding } from './padding'

export const layouts: Record<string, CSSProperties> = {
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxWidth: {
    maxWidth: 1080,
    margin: '0 auto',
    padding: padding.app,
  },
}
