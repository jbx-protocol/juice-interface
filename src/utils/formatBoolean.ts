import { t } from '@lingui/macro'

/**
 * Format a boolean value to a string.
 * @param value - The boolean value to format.
 * @returns The formatted string.
 */
export const formatBoolean = (bool: boolean) => (bool ? t`Yes` : t`No`)
