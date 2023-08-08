import { useWatch } from 'antd/lib/form/Form'
import { useProjectContext } from 'components/ProjectDashboard/hooks'
import { AddEditAllocationModalEntity } from 'components/v2v3/shared/Allocation/AddEditAllocationModal'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { ONE_BILLION } from 'constants/numbers'
import round from 'lodash/round'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useMemo } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import {
  hasEqualRecipient,
  isProjectSplit,
  totalSplitsPercent,
} from 'utils/splits'
import {
  V2V3CurrencyName,
  V2V3_CURRENCY_METADATA,
  getV2V3CurrencyOption,
} from 'utils/v2v3/currency'
import {
  adjustedSplitPercents,
  getNewDistributionLimit,
} from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'
import { useEditCycleFormContext } from '../../EditCycleFormContext'

const JB_FEE = 0.025

export const usePayoutsTable = () => {
  const { projectOwnerAddress } = useProjectContext()
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

  const currencyOrPercentSymbol = distributionLimitIsInfinite
    ? '%'
    : V2V3_CURRENCY_METADATA[getV2V3CurrencyOption(currency)].symbol

  /**
   * Sets the currency for the distributionLimit
   * @param currency - Currency as a V2V3CurrencyOption (1 | 2)
   */
  function setCurrency(currency: V2V3CurrencyOption) {
    editCycleForm?.setFieldsValue({
      distributionLimitCurrency: V2V3CurrencyName(currency),
    })
  }

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
    if (!distributionLimit || distributionLimitIsInfinite) return 0
    const amountBeforeFee =
      (payoutSplit.percent / ONE_BILLION) * distributionLimit
    if (isProjectSplit(payoutSplit) || dontApplyFee) return amountBeforeFee // projects dont have fee applied
    return deriveAmountAfterFee(amountBeforeFee)
  }

  /**
   * Convert parts-per-billion percent to formatted percent
   * @param percent - Percent of distributionLimit in parts-per-billion (PPB)
   * @returns Percent in standard format
   */
  function formattedPayoutPercent({
    payoutSplitPercent,
  }: {
    payoutSplitPercent: number
  }) {
    return round((payoutSplitPercent / ONE_BILLION) * 100, 2).toString()
  }

  /**
   * Handle payoutSplit added:
   *    - Sets new distributionLimit (DL) based on sum of new payout amounts
   *    - Changed the % of other splits based on the new DL keep their amount the same
   * @param newSplit - Just added split
   * @param newAmount - The new amount of the @editingPayoutSplit
   */
  function handleNewPayoutSplit({
    newSplit,
  }: {
    newSplit: AddEditAllocationModalEntity
  }) {
    const isProjectOwner = !(newSplit?.projectOwner === false)
    if (isProjectOwner) return
    const newSplitPercent = parseFloat(newSplit.amount.value)
    let newSplitPercentPPB = (newSplitPercent * ONE_BILLION) / 100
    let adjustedSplits: Split[] = payoutSplits
    let newDistributionLimit = distributionLimit

    // If amounts (!distributionLimitIsInfinite), handle changing DL and split %s
    if (!distributionLimitIsInfinite) {
      const newAmount = deriveAmountBeforeFee(newSplitPercent)
      // Convert the newAmount to its percentage of the new DL in parts-per-bill
      newDistributionLimit = distributionLimit
        ? getNewDistributionLimit({
            currentDistributionLimit: distributionLimit.toString(),
            newSplitAmount: newAmount,
            editingSplitPercent: 0,
            ownerRemainingAmount,
          })
        : undefined // undefined means DL is infinite

      newSplitPercentPPB =
        (newAmount / (newDistributionLimit ?? 0)) * ONE_BILLION

      // recalculate all split percents based on newly added split amount
      if (newDistributionLimit && !distributionLimitIsInfinite) {
        adjustedSplits = adjustedSplitPercents({
          splits: payoutSplits,
          oldDistributionLimit: (distributionLimit as number).toString() ?? '0',
          newDistributionLimit: newDistributionLimit.toString(),
        })
      }
    }

    const newPayoutSplit = {
      beneficiary: isProjectOwner ? projectOwnerAddress : newSplit.beneficiary,
      percent: newSplitPercentPPB,
      preferClaimed: false,
      lockedUntil: isProjectOwner ? undefined : newSplit.lockedUntil,
      projectId: isProjectOwner ? '0x00' : newSplit.projectId,
      allocator: NULL_ALLOCATOR_ADDRESS,
    } as Split

    const newPayoutSplits = [...adjustedSplits, newPayoutSplit]

    editCycleForm?.setFieldsValue({
      distributionLimit: newDistributionLimit,
      payoutSplits: newPayoutSplits,
    })
  }

  /**
   * Handle payoutSplit changed through the Edit modal:
   *    - Changes relevant split properties
   *    - If amount changed, calls handlePayoutSplitAmountChanged
   * @param editedPayoutSplit - Split that has been edited
   * @param newPayoutSplit - The new payout split to replace @editedPayoutSplit
   */
  function handlePayoutSplitChanged({
    editedPayoutSplit,
    newPayoutSplit,
  }: {
    editedPayoutSplit: Split
    newPayoutSplit: AddEditAllocationModalEntity
  }) {
    let newSplit = editedPayoutSplit
    // Find editedPayoutSplit in payoutSplits and change it to newPayoutSplit
    const newSplits = payoutSplits.map(m => {
      if (hasEqualRecipient(m, editedPayoutSplit)) {
        newSplit = {
          ...m,
          ...newPayoutSplit,
        }
        // If amounts (distributionLimitIsInfinite), further alterations to percentages are needed.
        // In this case, set the percent now.
        if (distributionLimitIsInfinite && !newPayoutSplit.projectOwner) {
          newSplit = {
            ...newSplit,
            percent:
              (parseFloat(newPayoutSplit.amount.value) * ONE_BILLION) / 100,
          }
        }
        return newSplit
      }
      return m
    })
    editCycleForm?.setFieldsValue({ payoutSplits: newSplits })
    if (!distributionLimitIsInfinite && !newPayoutSplit.projectOwner) {
      handlePayoutSplitAmountChanged({
        editingPayoutSplit: newSplit,
        newAmount: parseFloat(newPayoutSplit.amount.value),
      })
    }
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

    const _payoutSplits = editCycleForm?.getFieldValue('payoutSplits')
    let adjustedSplits: Split[] = _payoutSplits

    // recalculate all split percents based on newly added split amount
    if (newDistributionLimit && !distributionLimitIsInfinite) {
      adjustedSplits = adjustedSplitPercents({
        splits: _payoutSplits,
        oldDistributionLimit: (distributionLimit as number).toString() ?? '0',
        newDistributionLimit: newDistributionLimit.toString(),
      })
    }

    const newPayoutSplit = {
      ...editingPayoutSplit,
      percent: updatedPercentage,
    } as Split

    const newPayoutSplits = adjustedSplits.map(m =>
      hasEqualRecipient(m, editingPayoutSplit)
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

  /**
   * Handle payoutSplit amount deleted:
   *    - Deletes a payout split and adjusts the distributionLimit (DL) accordingly
   *    - Changed the % of other splits based on the new DL keep their amount the same
   * @param split - Split to be deleted
   */
  function handleDeletePayoutSplit({ payoutSplit }: { payoutSplit: Split }) {
    const newSplits = payoutSplits.filter(
      m => !hasEqualRecipient(m, payoutSplit),
    )

    let adjustedSplits: Split[] = newSplits
    let newDistributionLimit = distributionLimit
    if (distributionLimit && !distributionLimitIsInfinite) {
      const currentAmount = derivePayoutAmount({
        payoutSplit,
        dontApplyFee: true,
      })
      newDistributionLimit = distributionLimit - currentAmount
      adjustedSplits = adjustedSplitPercents({
        splits: newSplits,
        oldDistributionLimit: (distributionLimit as number).toString() ?? '0',
        newDistributionLimit: newDistributionLimit.toString(),
      })
    }

    editCycleForm?.setFieldsValue({
      distributionLimit: newDistributionLimit,
      payoutSplits: adjustedSplits,
    })
  }

  function handleDeleteAllPayoutSplits() {
    editCycleForm?.setFieldsValue({
      distributionLimit: 0,
      payoutSplits: [],
    })
  }

  const amountOrPercentValue = ({
    payoutSplit,
    dontApplyFee,
  }: {
    payoutSplit: Split
    dontApplyFee?: boolean
  }) =>
    distributionLimitIsInfinite
      ? (payoutSplit.percent / ONE_BILLION) * 100
      : derivePayoutAmount({ payoutSplit, dontApplyFee })

  /* Total amount that leaves the treasury minus fees */
  const subTotal = payoutSplits.reduce((acc, payoutSplit) => {
    const reducer = amountOrPercentValue({ payoutSplit })
    return acc + reducer
  }, 0)

  /* Payouts that don't go to Juicebox projects incur 2.5% fee */
  const nonJuiceboxProjectPayoutSplits = payoutSplits.filter(
    payoutSplit => !isProjectSplit(payoutSplit),
  )

  /* Count the total fee amount. If % of payouts sums > 100, just set fees to 2.5% (maximum)*/
  const totalFeeAmount =
    distributionLimitIsInfinite && round(subTotal, roundingPrecision) > 100
      ? 2.5
      : nonJuiceboxProjectPayoutSplits.reduce((acc, payoutSplit) => {
          return (
            acc +
            amountOrPercentValue({ payoutSplit, dontApplyFee: true }) * JB_FEE
          )
        }, 0)

  return {
    distributionLimit,
    distributionLimitIsInfinite,
    currency,
    setCurrency,
    currencyOrPercentSymbol,
    payoutSplits,
    derivePayoutAmount,
    formattedPayoutPercent,
    roundingPrecision,
    handlePayoutSplitAmountChanged,
    handleNewPayoutSplit,
    handlePayoutSplitChanged,
    handleDeletePayoutSplit,
    handleDeleteAllPayoutSplits,
    subTotal,
    ownerRemainderValue,
    totalFeeAmount,
  }
}
