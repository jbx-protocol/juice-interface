import { t } from '@lingui/macro'

export type DurationUnitsOption = 'days' | 'hrs' | 'mins' | 'secs'

export const DURATION_UNIT_OPTIONS: DurationUnitsOption[] = [
  'days',
  'hrs',
  'mins',
  'secs',
]

export const durationUnitText = (unit: DurationUnitsOption) => {
  switch (unit) {
    case 'secs':
      return t`Seconds`
    case 'hrs':
      return t`Hours`
    case 'mins':
      return t`Minutes`
    default:
      return t`Days`
  }
}
