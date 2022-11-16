import * as styleColors from 'constants/styles/colors'
import { CSSProperties } from 'react'

export const emphasisedTextStyle = (fontSize?: string): CSSProperties => ({
  fontWeight: 500,
  fontSize: fontSize ?? '1rem',
})

export const headerTextStyle = (isDarkMode: boolean): CSSProperties => ({
  color: isDarkMode
    ? styleColors.darkColors.darkGray300
    : styleColors.lightColors.gray600,
  fontWeight: 400,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
})

export const flexColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}
