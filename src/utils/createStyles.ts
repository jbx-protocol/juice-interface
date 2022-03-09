import { CSSProperties } from 'react'

export default function createStyles<
  T extends { [name: string]: CSSProperties },
>(styles: T) {
  return styles
}
