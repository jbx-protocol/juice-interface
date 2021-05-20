import { juiceColors } from 'constants/styles/colors'
import { SemanticColors } from 'models/semantic-theme/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const iconColors: Record<ThemeOption, SemanticColors['icon']> = {
  [ThemeOption.light]: {
    primary: '#000000ee',
    secondary: '#00000099',
    tertiary: '#00000055',
    placeholder: juiceColors.light2,
    disabled: juiceColors.light2 + 'dd',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.cta,
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
        highlight: juiceColors.ctaHighlight,
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
    placeholder: juiceColors.light2,
    disabled: juiceColors.light2 + 'dd',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    action: {
      primary: juiceColors.cta,
      secondary: juiceColors.cta,
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
}
