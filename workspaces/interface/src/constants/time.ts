import { t } from '@lingui/macro'

export type DurationUnitsOption = 'days' | 'hours' | 'minutes' | 'seconds'

export const DURATION_UNIT_OPTIONS: DurationUnitsOption[] = [
  'days',
  'hours',
  'minutes',
  'seconds',
]

export const durationUnitText = (unit: DurationUnitsOption) => {
  switch (unit) {
    case 'seconds':
      return t`Seconds`
    case 'hours':
      return t`Hours`
    case 'minutes':
      return t`Minutes`
    default:
      return t`Days`
  }
}
