import { useWatch } from 'antd/lib/form/Form'
import { ONE_BILLION } from 'constants/numbers'
import round from 'lodash/round'
import { Split } from 'models/splits'
import { useMemo } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { isProjectSplit, totalSplitsPercent } from 'utils/splits'
import {
  adjustedSplitPercents,
  getNewDistributionLimit,
} from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

const JB_FEE = 0.025

export const usePayoutsTable = () => {
  const { editCycleForm } = useEditCycleFormContext()
  const distributionLimit = useWatch('distributionLimit', editCycleForm)
  const currency = useWatch('distributionLimitCurrency', editCycleForm)
  const payoutSplits = useWatch('payoutSplits', editCycleForm) ?? []

  const roundingPrecision = currency === 'ETH' ? 4 : 2

  const distributionLimitIsInfinite = useMemo(
    () =>
      !distributionLimit ||
      parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT),
    [distributionLimit],
  )

  const ownerRemainingPercentPPB =
    SPLITS_TOTAL_PERCENT - totalSplitsPercent(payoutSplits) // parts-per-billion
  const ownerRemainingAmount =
    distributionLimit && !distributionLimitIsInfinite
      ? (ownerRemainingPercentPPB / ONE_BILLION) * distributionLimit
      : undefined

  const ownerRemainderValue = round(
    ownerRemainingAmount ?? (ownerRemainingPercentPPB / ONE_BILLION) * 100,
    roundingPrecision,
  )

  /**
   * Derive payout amount before the fee has been applied.
   * @param amount - An amount that has already had the fee applied
   * @returns Amount @amount plus the JB fee
   */
  function deriveAmountBeforeFee(amount: number) {
    return amount / (1 - JB_FEE)
  }

  /**
   * Derive payout amount after the fee has been applied.
   * @param amount - Amount before fee applied
   * @returns Amount @amount minus the JB fee
   */
  function deriveAmountAfterFee(amount: number) {
    return amount - amount * JB_FEE
  }

  /**
   * Derive payout amount from the % of the distributionLimit
   * @param percent - Percent of distributionLimit in parts-per-billion (PPB)
   * @returns Amount in the distributionLimitCurrency.
   */
  function derivePayoutAmount({
    payoutSplit,
    dontApplyFee,
  }: {
    payoutSplit: Split
    dontApplyFee?: boolean
  }) {
    if (!distributionLimit) return 0
    const amountBeforeFee =
      (payoutSplit.percent / ONE_BILLION) * distributionLimit
    if (isProjectSplit(payoutSplit) || dontApplyFee) return amountBeforeFee // projects dont have fee applied
    return deriveAmountAfterFee(amountBeforeFee)
  }

  /**
   * Handle payoutSplit amount changed:
   *    - Sets new distributionLimit (DL) based on sum of new payout amounts
   *    - Changed the % of other splits based on the new DL keep their amount the same
   * @param editingPayoutSplit - Split that has had its amount changed
   * @param newAmount - The new amount of the @editingPayoutSplit
   */
  function handlePayoutSplitAmountChanged({
    editingPayoutSplit,
    newAmount,
  }: {
    editingPayoutSplit: Split
    newAmount: number
  }) {
    const _amount = isProjectSplit(editingPayoutSplit)
      ? newAmount
      : deriveAmountBeforeFee(newAmount)
    // Convert the newAmount to its percentage of the new DL in parts-per-bill
    const newDistributionLimit = distributionLimit
      ? getNewDistributionLimit({
          currentDistributionLimit: distributionLimit.toString(),
          newSplitAmount: _amount,
          editingSplitPercent: editingPayoutSplit.percent,
          ownerRemainingAmount,
        })
      : undefined // undefined means DL is infinite

    const updatedPercentage =
      (_amount / (newDistributionLimit ?? 0)) * ONE_BILLION
    let adjustedSplits: Split[] = payoutSplits

    // recalculate all split percents based on newly added split amount
    if (newDistributionLimit && !distributionLimitIsInfinite) {
      adjustedSplits = adjustedSplitPercents({
        splits: payoutSplits,
        oldDistributionLimit: (distributionLimit as number).toString() ?? '0',
        newDistributionLimit: newDistributionLimit.toString(),
      })
    }

    const newPayoutSplit = {
      ...editingPayoutSplit,
      percent: updatedPercentage,
    } as Split

    const newPayoutSplits = adjustedSplits.map(m =>
      m.beneficiary === newPayoutSplit?.beneficiary &&
      m.projectId === newPayoutSplit?.projectId
        ? {
            ...m,
            ...newPayoutSplit,
          }
        : m,
    )

    editCycleForm?.setFieldsValue({
      distributionLimit: newDistributionLimit,
      payoutSplits: newPayoutSplits,
    })
  }

  /* Total amount that leaves the treasury minus fees */
  const subTotal = payoutSplits.reduce((acc, payoutSplit) => {
    return acc + derivePayoutAmount({ payoutSplit })
  }, 0)

  /* Payouts that don't go to Juicebox projects incur 2.5% fee */
  const nonJuiceboxProjectPayoutSplits = payoutSplits.filter(
    payoutSplit => !isProjectSplit(payoutSplit),
  )
  const totalFeeAmount = nonJuiceboxProjectPayoutSplits.reduce(
    (acc, payoutSplit) => {
      return acc + derivePayoutAmount({ payoutSplit }) * JB_FEE
    },
    0,
  )

  return {
    distributionLimit,
    distributionLimitIsInfinite,
    currency,
    payoutSplits,
    derivePayoutAmount,
    roundingPrecision,
    handlePayoutSplitAmountChanged,
    subTotal,
    ownerRemainderValue,
    totalFeeAmount,
  }
}
