import { t } from '@lingui/macro'

/**
 * Format a boolean value to a string.
 * @param value - The boolean value to format.
 * @returns The formatted string.
 */
export const formatBoolean = (bool: boolean | undefined) =>
  bool ? t`Yes` : t`No`

/**
 * Format a boolean value to a string. Alternative to formatBoolean.
 * @param value - The boolean value to format.
 * @returns The formatted string.
 */
export const formatEnabled = (bool: boolean | undefined) =>
  bool ? t`Enabled` : t`Disabled`
