import { juiceColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'
import { SemanticColors } from 'models/semantic-theme/colors'

export const textColors: Record<ThemeOption, SemanticColors['text']> = {
  [ThemeOption.light]: {
    primary: juiceColors.black,
    secondary: juiceColors.black,
    tertiary: juiceColors.black,
    placeholder: juiceColors.light2,
    disabled: juiceColors.light2 + 'dd',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    header: juiceColors.juiceOrange,
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
  [ThemeOption.dark]: {
    primary: juiceColors.light0,
    secondary: juiceColors.light1,
    tertiary: juiceColors.light2,
    placeholder: juiceColors.light3,
    disabled: juiceColors.light2 + 'dd',
    success: juiceColors.green,
    warn: juiceColors.yellow,
    failure: juiceColors.red,
    header: juiceColors.juiceOrange,
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
