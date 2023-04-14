import NumberSlider from 'components/inputs/NumberSlider'
import { useCallback, useState } from 'react'
import { AmountPercentageInput } from '../types'

export const PercentageInput = ({
  value,
  onChange,
}: {
  value?: AmountPercentageInput
  onChange?: (input: AmountPercentageInput | undefined) => void
}) => {
  const [_percentage, _setPercentage] = useState<
    AmountPercentageInput | undefined
  >({
    value: '',
    isPercent: true,
  })
  const percentage = value ?? _percentage
  const setPercentage = onChange ?? _setPercentage

  const onAmountInputChange = useCallback(
    (percentage: AmountPercentageInput | undefined) => {
      setPercentage(percentage)
      return
    },
    [setPercentage],
  )

  return (
    <NumberSlider
      sliderValue={percentage ? parseFloat(percentage.value) : 0}
      onChange={percentage =>
        onAmountInputChange({
          value: percentage?.toString() ?? '',
          isPercent: true,
        })
      }
      step={0.01}
      defaultValue={0}
      suffix="%"
    />
  )
}
