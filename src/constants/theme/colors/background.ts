import { SemanticColors } from 'models/semantic-theme/colors'

import { darkColors, lightColors } from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const backgroundColors: Record<
  ThemeOption,
  SemanticColors['background']
> = {
  [ThemeOption.light]: {
    l0: '#FEFDFB',
    l1: lightColors.warmGray200,
    l2: '#f5f4ef',
    l3: '#FBF9F6',
    disabled: '#00000018',
    success: lightColors.green,
    warn: lightColors.juiceLighter,
    failure: lightColors.red,
    brand: {
      primary: lightColors.juiceOrange,
      secondary: lightColors.juiceLight,
    },
    action: {
      primary: lightColors.cta,
      secondary: '#32c8db44',
      highlight: '#3dd1e4',
    },
    deselected: lightColors.warmGray200,
    over: {
      action: {
        primary: lightColors.warmGray150,
        // TODO: START - all colors
        secondary: lightColors.cta,
        highlight: lightColors.ctaHighlight,
      },
      brand: {
        primary: lightColors.white,
        secondary: lightColors.black,
      },
      disabled: lightColors.white,
      failure: lightColors.white,
      success: lightColors.white,
      warn: lightColors.white,
      // TODO: END - all colors
    },
  },
  [ThemeOption.dark]: {
    l0: darkColors.dark0,
    l1: darkColors.dark1,
    l2: darkColors.dark2,
    l3: darkColors.dark3,
    disabled: darkColors.light0 + '44',
    success: darkColors.green,
    warn: darkColors.juiceDarkest,
    failure: darkColors.red,
    brand: {
      primary: darkColors.juiceOrange,
      secondary: darkColors.juiceLight,
    },
    action: {
      primary: darkColors.cta,
      secondary: darkColors.ctaHint,
      highlight: darkColors.ctaHighlight,
    },
    deselected: darkColors.darkGray500,
    over: {
      action: {
        primary: darkColors.darkGray400,
        // TODO: START - all colors
        secondary: darkColors.cta,
        highlight: darkColors.ctaHighlight,
      },
      brand: {
        primary: darkColors.white,
        secondary: darkColors.black,
      },
      disabled: darkColors.white,
      failure: darkColors.white,
      success: darkColors.white,
      warn: darkColors.white,
      // TODO: END - all colors
    },
  },
}
