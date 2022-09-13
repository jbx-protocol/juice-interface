import { SemanticColors } from 'models/semantic-theme/colors'

import { darkColors, lightColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const iconColors: Record<ThemeOption, SemanticColors['icon']> = {
  [ThemeOption.light]: {
    primary: lightColors.dark0,
    secondary: lightColors.dark1,
    tertiary: lightColors.dark2,
    disabled: lightColors.dark3,
    success: lightColors.green,
    warn: lightColors.yellow,
    failure: lightColors.red,
    action: {
      primary: lightColors.cta,
      secondary: lightColors.cta,
    },
    brand: {
      primary: lightColors.juiceOrange,
      secondary: lightColors.juiceLight,
    },
    over: {
      brand: {
        primary: lightColors.white,
        secondary: lightColors.black,
      },
      action: {
        primary: lightColors.white,
        secondary: lightColors.cta,
        highlight: lightColors.ctaHighlight,
      },
      success: lightColors.white,
      warn: lightColors.white,
      failure: lightColors.white,
      disabled: lightColors.dark2,
    },
  },
  [ThemeOption.dark]: {
    primary: darkColors.light0,
    secondary: darkColors.light1,
    tertiary: darkColors.light2,
    disabled: darkColors.light2,
    success: darkColors.green,
    warn: darkColors.yellow,
    failure: darkColors.red,
    action: {
      primary: darkColors.cta,
      secondary: darkColors.cta,
    },
    brand: {
      primary: darkColors.juiceOrange,
      secondary: darkColors.juiceLight,
    },
    over: {
      brand: {
        primary: darkColors.white,
        secondary: darkColors.black,
      },
      action: {
        primary: darkColors.white,
        secondary: darkColors.cta,
        highlight: darkColors.dark0,
      },
      success: darkColors.white,
      warn: darkColors.white,
      failure: darkColors.white,
      disabled: darkColors.light2,
    },
  },
}
