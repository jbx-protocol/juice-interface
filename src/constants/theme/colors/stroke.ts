import { SemanticColors } from 'models/semantic-theme/colors'

import {
  dark1Colors,
  darkColors,
  light1Colors,
  lightColors,
} from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const strokeColors: Record<ThemeOption, SemanticColors['stroke']> = {
  [ThemeOption.light]: {
    primary: '#00000048',
    secondary: '#00000032',
    tertiary: '#00000018',
    success: lightColors.green,
    warn: lightColors.yellow,
    failure: lightColors.red,
    disabled: '#00000018',
    action: {
      primary: lightColors.cta,
      secondary: '#32c8db44',
      highlight: '#3dd1e4',
    },
  },
  [ThemeOption.dark]: {
    primary: darkColors.light1,
    secondary: darkColors.light2,
    tertiary: darkColors.light3,
    success: darkColors.green,
    warn: darkColors.yellow,
    failure: darkColors.red,
    disabled: darkColors.light0 + '24',
    action: {
      primary: darkColors.cta,
      secondary: darkColors.light3,
      highlight: darkColors.ctaHighlight,
    },
  },
  [ThemeOption.light1]: {
    primary: '#00000048',
    secondary: '#00000032',
    tertiary: '#00000018',
    success: lightColors.green,
    warn: lightColors.yellow,
    failure: lightColors.red,
    disabled: '#00000018',
    action: {
      primary: light1Colors.grapeUltra,
      secondary: light1Colors.grapeUltra,
      highlight: light1Colors.grapeUltra,
    },
  },
  [ThemeOption.dark1]: {
    primary: dark1Colors.light1,
    secondary: dark1Colors.light2,
    tertiary: dark1Colors.light3,
    success: darkColors.green,
    warn: darkColors.yellow,
    failure: darkColors.red,
    disabled: dark1Colors.light0 + '24',
    action: {
      primary: dark1Colors.grapeUltra,
      secondary: dark1Colors.light3,
      highlight: dark1Colors.grapeUltra,
    },
  },
}
