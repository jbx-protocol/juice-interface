import { SemanticColors } from 'models/semantic-theme/colors'

import { darkColors, lightColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const textColors: Record<ThemeOption, SemanticColors['text']> = {
  [ThemeOption.light]: {
    primary: lightColors.dark0,
    secondary: lightColors.dark1,
    tertiary: lightColors.dark2,
    placeholder: lightColors.dark2,
    disabled: lightColors.dark3,
    success: lightColors.green,
    warn: lightColors.yellow,
    failure: lightColors.red,
    header: lightColors.juiceOrange,
    action: {
      primary: lightColors.cta,
      secondary: lightColors.cta,
      highlight: lightColors.ctaHighlight,
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
        highlight: lightColors.dark0,
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
    placeholder: darkColors.light3,
    disabled: darkColors.light2,
    success: darkColors.green,
    warn: darkColors.yellow,
    failure: darkColors.red,
    header: darkColors.juiceOrange,
    action: {
      primary: darkColors.cta,
      secondary: darkColors.cta,
      highlight: darkColors.ctaHighlight,
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
        primary: darkColors.dark0,
        secondary: darkColors.light0,
        highlight: darkColors.dark0,
      },
      success: darkColors.white,
      warn: darkColors.white,
      failure: darkColors.white,
      disabled: darkColors.light2,
    },
  },
}
