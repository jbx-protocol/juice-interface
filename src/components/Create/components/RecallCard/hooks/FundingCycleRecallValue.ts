import { useAppSelector } from 'hooks/AppSelector'
import { deriveDurationUnit, secondsToOtherUnit } from 'utils/format/formatTime'

const formatUnit = ({ unit, plural }: { unit: string; plural: boolean }) => {
  let formatted = unit.charAt(0).toUpperCase() + unit.slice(1)
  if (formatted.endsWith('s')) {
    if (!plural) {
      formatted = formatted.slice(0, -1)
    }
  }
  return formatted
}

const formatFundingCycle = (duration: string) => {
  const durationAsNumber = parseInt(duration)
  if (isNaN(durationAsNumber)) return 'No duration'

  const derivedUnit = deriveDurationUnit(durationAsNumber)
  const formattedDuration = secondsToOtherUnit({
    duration: durationAsNumber,
    unit: derivedUnit,
  })

  const formattedUnit = formatUnit({
    unit: derivedUnit,
    plural: formattedDuration > 1,
  })
  return `${secondsToOtherUnit({
    duration: durationAsNumber,
    unit: derivedUnit,
  })} ${formattedUnit}`
}

export const useFundingCycleRecallValue = () => {
  const {
    fundingCycleData: { duration },
  } = useAppSelector(state => state.editingV2Project)

  if (duration === '') return undefined

  if (duration === '0') return 'No duration'

  return formatFundingCycle(duration)
}
