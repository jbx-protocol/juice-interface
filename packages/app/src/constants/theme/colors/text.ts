import { juiceColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'
import { SemanticColors } from 'models/semantic-theme/colors'

export const textColors: Record<ThemeOption, SemanticColors['text']> = {
  [ThemeOption.light]: {
    primary: '#000000ee',
    secondary: '#00000099',
    tertiary: '#00000055',
    placeholder: juiceColors.light0,
    disabled: '#00000048',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    header: juiceColors.juiceOrange,
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.cta,
      highlight: '#34dbf1',
    },
    brand: {
      primary: juiceColors.juiceOrange,
      secondary: juiceColors.juiceLight,
    },
    over: {
      brand: {
        primary: juiceColors.white,
        secondary: juiceColors.black,
      },
      action: {
        primary: juiceColors.white,
        secondary: juiceColors.cta,
        highlight: juiceColors.dark0,
      },
      success: juiceColors.white,
      warn: juiceColors.white,
      failure: juiceColors.white,
      disabled: juiceColors.light2,
    },
  },
  [ThemeOption.dark]: {
    primary: juiceColors.light0,
    secondary: juiceColors.light1,
    tertiary: juiceColors.light2,
    placeholder: juiceColors.light3,
    disabled: juiceColors.light2,
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    header: juiceColors.juiceOrange,
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.cta,
      highlight: juiceColors.ctaHighlight,
    },
    brand: {
      primary: juiceColors.juiceOrange,
      secondary: juiceColors.juiceLight,
    },
    over: {
      brand: {
        primary: juiceColors.white,
        secondary: juiceColors.black,
      },
      action: {
        primary: juiceColors.dark0,
        secondary: juiceColors.light0,
        highlight: juiceColors.dark0,
      },
      success: juiceColors.white,
      warn: juiceColors.white,
      failure: juiceColors.white,
      disabled: juiceColors.light2,
    },
  },
}
