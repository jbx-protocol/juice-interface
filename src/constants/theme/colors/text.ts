import { SemanticColors } from 'models/semantic-theme/colors'

import {
  dark1Colors,
  darkColors,
  light1Colors,
  lightColors,
} from 'constants/styles/colors'
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
  [ThemeOption.light1]: {
    primary: light1Colors.dark0,
    secondary: light1Colors.dark1,
    tertiary: light1Colors.dark2,
    placeholder: light1Colors.dark2,
    disabled: light1Colors.dark3,
    success: lightColors.green,
    warn: lightColors.yellow,
    failure: lightColors.red,
    header: light1Colors.bannySplit,
    action: {
      primary: light1Colors.grapeUltra,
      secondary: light1Colors.grapeUltra,
      highlight: light1Colors.grapeUltra,
    },
    brand: {
      primary: light1Colors.bannySplit,
      secondary: light1Colors.bannySplit,
    },
    over: {
      brand: {
        primary: light1Colors.white,
        secondary: light1Colors.black,
      },
      action: {
        primary: light1Colors.white,
        secondary: light1Colors.grapeUltra,
        highlight: light1Colors.dark0,
      },
      success: light1Colors.white,
      warn: light1Colors.white,
      failure: light1Colors.white,
      disabled: light1Colors.dark2,
    },
  },
  [ThemeOption.dark1]: {
    primary: dark1Colors.light0,
    secondary: dark1Colors.light1,
    tertiary: dark1Colors.light2,
    placeholder: dark1Colors.light3,
    disabled: dark1Colors.light2,
    success: darkColors.green,
    warn: darkColors.yellow,
    failure: darkColors.red,
    header: dark1Colors.bannySplit,
    action: {
      primary: dark1Colors.grapeUltra,
      secondary: dark1Colors.grapeUltra,
      highlight: dark1Colors.grapeUltra,
    },
    brand: {
      primary: dark1Colors.bannySplit,
      secondary: dark1Colors.bannySplit,
    },
    over: {
      brand: {
        primary: dark1Colors.white,
        secondary: dark1Colors.black,
      },
      action: {
        primary: dark1Colors.dark0,
        secondary: dark1Colors.light0,
        highlight: dark1Colors.dark0,
      },
      success: dark1Colors.white,
      warn: dark1Colors.white,
      failure: dark1Colors.white,
      disabled: dark1Colors.light2,
    },
  },
}
