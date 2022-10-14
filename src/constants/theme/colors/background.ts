import { SemanticColors } from 'models/semantic-theme/colors'

import {
  dark1Colors,
  darkColors,
  light1Colors,
  lightColors,
} from 'constants/styles/colors'
import { ThemeOption } from 'constants/theme/theme-option'

export const backgroundColors: Record<
  ThemeOption,
  SemanticColors['background']
> = {
  [ThemeOption.light]: {
    l0: '#FEFDFB',
    l1: '#e7e3dc',
    l2: '#f5f4ef',
    disabled: '#00000018',
    success: lightColors.green,
    warn: lightColors.yellow,
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
  },
  [ThemeOption.dark]: {
    l0: darkColors.dark0,
    l1: darkColors.dark1,
    l2: darkColors.dark2,
    disabled: darkColors.light0 + '44',
    success: darkColors.green,
    warn: darkColors.yellow,
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
  },
  [ThemeOption.light1]: {
    l0: '#FEFDFB',
    l1: '#e7e3dc',
    l2: '#f5f4ef',
    disabled: '#00000018',
    success: lightColors.green,
    warn: lightColors.yellow,
    failure: lightColors.red,
    brand: {
      primary: light1Colors.bannySplit,
      secondary: light1Colors.grapeUltra,
    },
    action: {
      primary: light1Colors.koolMint,
      secondary: light1Colors.koolMint,
      highlight: light1Colors.koolMint,
    },
  },
  [ThemeOption.dark1]: {
    l0: dark1Colors.dark0,
    l1: dark1Colors.dark1,
    l2: dark1Colors.dark2,
    disabled: dark1Colors.light0 + '44',
    success: darkColors.green,
    warn: darkColors.yellow,
    failure: darkColors.red,
    brand: {
      primary: light1Colors.bannySplit,
      secondary: light1Colors.grapeUltra,
    },
    action: {
      primary: light1Colors.koolMint,
      secondary: light1Colors.koolMint,
      highlight: light1Colors.koolMint,
    },
  },
}
