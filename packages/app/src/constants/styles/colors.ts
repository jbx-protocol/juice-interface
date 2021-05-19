import { Property } from 'csstype'

export type JuiceColor =
  | 'black'
  | 'white'
  | 'light0'
  | 'light1'
  | 'light2'
  | 'light3'
  | 'dark0'
  | 'dark1'
  | 'dark2'
  | 'grape'
  | 'grapeHint'
  | 'juiceOrange'
  | 'juiceLight'
  | 'cta'
  | 'ctaHighlight'
  | 'ctaHint'
  | 'green'
  | 'red'
  | 'yellow'

export const juiceColors: Record<JuiceColor, Property.Color> = {
  black: '#000',
  white: '#fff',
  light0: '#d9d5e0',
  light1: '#d9d5e096',
  light2: '#d9d5e068',
  light3: '#d9d5e048',
  dark0: '#131115',
  dark1: '#241c2b',
  dark2: '#392b46',
  grape: '#574c67',
  grapeHint: '#574c6748',
  juiceOrange: '#FFB32C',
  juiceLight: '#FFECBB',
  cta: '#32c8db',
  ctaHighlight: '#38e9ff',
  ctaHint: '#32c8db22',
  green: 'green',
  red: 'tomato',
  yellow: 'yellow',
}
