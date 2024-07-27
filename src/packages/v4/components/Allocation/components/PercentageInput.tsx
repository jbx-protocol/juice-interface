import { AmountPercentageInput } from 'components/Allocation/types'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import NumberSlider from 'components/inputs/NumberSlider'
import round from 'lodash/round'
import { V4CurrencyName } from 'packages/v4/utils/currency'
import { isFinitePayoutLimit } from 'packages/v4/utils/fundingCycle'
import { useCallback, useMemo, useState } from 'react'
import { formatWad, stripCommas } from 'utils/format/formatNumber'
import { Allocation } from '../Allocation'

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

  const { totalAllocationAmount, allocationCurrency } =
    Allocation.useAllocationInstance()

  const hasTotalAllocationAmount = useMemo(
    () => isFinitePayoutLimit(totalAllocationAmount),
    [totalAllocationAmount],
  )

  const percentage = value ?? _percentage
  const setPercentage = onChange ?? _setPercentage

  const onAmountInputChange = useCallback(
    (percentage: AmountPercentageInput | undefined) => {
      setPercentage(percentage)
      return
    },
    [setPercentage],
  )

  const totalAllocationAmountNum = parseFloat(
    stripCommas(formatWad(totalAllocationAmount) ?? '0'),
  )
  const currencyName = V4CurrencyName(allocationCurrency)
  const roundedAmount = round(
    (percentage ? parseFloat(percentage.value) / 100 : 0) *
      totalAllocationAmountNum,
    currencyName === 'ETH' ? 4 : 2,
  )
  return (
    <div className="flex items-center">
      <div className="h-9 flex-grow">
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
      </div>
      {/* Read-only amount if distribution limit is not infinite  */}
      {hasTotalAllocationAmount ? (
        <div className="ml-3">
          <CurrencySymbol currency={currencyName} />
          {roundedAmount}
        </div>
      ) : null}
    </div>
  )
}
