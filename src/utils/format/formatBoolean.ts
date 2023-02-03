import { t } from '@lingui/macro'

/**
 * Format a boolean value to a string.
 * @param value - The boolean value to format.
 * @returns The formatted string.
 */
export const formatBoolean = (bool: boolean | null | undefined) =>
  bool ? t`Yes` : t`No`

/**
 * Format a boolean value to a string. Alternative to formatBoolean.
 * @param value - The boolean value to format.
 * @returns The formatted string.
 */
export const formatEnabled = (bool: boolean | null | undefined) =>
  bool ? t`Enabled` : t`Disabled`

/**
 * Format a pause-related boolean value to a string.
 * @param value - The boolean value to format.
 * @returns The formatted string.
 */
export const formatPaused = (bool: boolean | null | undefined) =>
  bool ? t`Paused` : t`Enabled`

/**
 * Format a pause-related boolean value to a string.
 * @param value - The boolean value to format.
 * @returns The formatted string.
 */
export const formatAllowed = (bool: boolean | null | undefined) =>
  bool ? t`Allowed` : t`Not allowed`
