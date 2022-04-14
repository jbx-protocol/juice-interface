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
      return `seconds` //TODO: Make translations when text confirmed
    case 'hrs':
      return `hours`
    case 'mins':
      return `minutes`
    default:
      return `days`
  }
}
