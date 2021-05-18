import { CSSProperties } from 'react'

export type SemanticRadii = Record<
  'xs' | 'sm' | 'md' | 'lg' | 'xl',
  CSSProperties['borderRadius']
>
