import { AddEditAllocationModalEntity } from 'components/v2v3/shared/Allocation/AddEditAllocationModal'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { ONE_BILLION, WAD_DECIMALS } from 'constants/numbers'
import isEqual from 'lodash/isEqual'
import round from 'lodash/round'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useMemo } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import {
  getProjectOwnerRemainderSplit,
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
  JB_FEE,
  adjustedSplitPercents,
  deriveAmountAfterFee,
  deriveAmountBeforeFee,
  derivePayoutAmount,
  ensureSplitsSumTo100Percent,
  getNewDistributionLimit,
} from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT, SPLITS_TOTAL_PERCENT } from 'utils/v2v3/math'
import { useEditCycleFormContext } from '../../../V2V3Project/V2V3ProjectSettings/pages/EditCyclePage/EditCycleFormContext'
import { usePayoutsTableContext } from '../context/PayoutsTableContext'

export const usePayoutsTable = () => {
  const {
    payoutSplits,
    setPayoutSplits,
    distributionLimit,
    setDistributionLimit,
    currency,
    setCurrency: setCurrencyName,
  } = usePayoutsTableContext()
  const { setFormHasUpdated } = useEditCycleFormContext()
  const distributionLimitIsInfinite = useMemo(
    () =>
      distributionLimit === undefined ||
      parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT),
    [distributionLimit],
  )

  const amountOrPercentValue = ({
    payoutSplit,
    dontApplyFee,
  }: {
    payoutSplit: Split
    dontApplyFee?: boolean
  }) =>
    distributionLimitIsInfinite
      ? (payoutSplit.percent / ONE_BILLION) * 100
      : _derivePayoutAmount({ payoutSplit, dontApplyFee })

  /* Total amount that leaves the treasury minus fees */
  const subTotal = payoutSplits.reduce((acc, payoutSplit) => {
    const reducer = amountOrPercentValue({ payoutSplit })
    return acc + reducer
  }, 0)

  let roundingPrecision = currency === 'ETH' ? 4 : 2
  // If subTotal exceeds 100%, set rounding precision to exceeding decimal amount
  // e.g. subTotal = 100.00001, roundingPrecision = 5
  if (distributionLimitIsInfinite && subTotal > 100) {
    const decimalPart = subTotal - Math.floor(subTotal)
    if (decimalPart > 0) {
      const decimalStr = decimalPart.toString()
      const decimalPrecision = decimalStr.slice(
        decimalStr.indexOf('.') + 1,
      ).length
      roundingPrecision = Math.max(roundingPrecision, decimalPrecision)
    }
  }

  const ownerRemainingPercentPPB =
    SPLITS_TOTAL_PERCENT - totalSplitsPercent(payoutSplits) // parts-per-billion
  const ownerRemainingAmount =
    distributionLimit && !distributionLimitIsInfinite
      ? deriveAmountAfterFee(
          (ownerRemainingPercentPPB / ONE_BILLION) * distributionLimit,
        )
      : undefined

  const ownerRemainderValue = round(
    ownerRemainingAmount ?? (ownerRemainingPercentPPB / ONE_BILLION) * 100,
    roundingPrecision,
  )

  const currencyOrPercentSymbol = distributionLimitIsInfinite
    ? '%'
    : V2V3_CURRENCY_METADATA[getV2V3CurrencyOption(currency)].symbol

  /* Payouts that don't go to Juicebox projects incur 2.5% fee */
  const nonJuiceboxProjectPayoutSplits = [
    ...payoutSplits.filter(payoutSplit => !isProjectSplit(payoutSplit)),
    getProjectOwnerRemainderSplit(
      // remaining owner split also incurs fee
      '',
      payoutSplits,
    ) as Split,
  ]

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

  /**
   * Sets the currency for the distributionLimit
   * @param currency - Currency as a V2V3CurrencyOption (1 | 2)
   */
  function setCurrency(currency: V2V3CurrencyOption) {
    setCurrencyName?.(V2V3CurrencyName(currency) ?? 'ETH')
    setFormHasUpdated(true)
  }

  function setSplits100Percent() {
    setPayoutSplits?.(ensureSplitsSumTo100Percent({ splits: payoutSplits }))
  }

  function _setPayoutSplits(splits: Split[]) {
    if (distributionLimitIsInfinite) {
      setPayoutSplits?.(splits)
    } else {
      setPayoutSplits?.(ensureSplitsSumTo100Percent({ splits }))
    }
    setFormHasUpdated(true)
  }

  function _setDistributionLimit(distributionLimit: number | undefined) {
    const _distributionLimit =
      distributionLimit !== undefined
        ? round(distributionLimit, WAD_DECIMALS)
        : undefined
    setDistributionLimit?.(_distributionLimit)
  }

  /**
   * Derive payout amount from the % of the distributionLimit
   * @param percent - Percent of distributionLimit in parts-per-billion (PPB)
   * @returns Amount in the distributionLimitCurrency.
   */
  function _derivePayoutAmount({
    payoutSplit,
    dontApplyFee,
  }: {
    payoutSplit: Split
    dontApplyFee?: boolean
  }) {
    return derivePayoutAmount({
      payoutSplit,
      distributionLimit,
      dontApplyFee,
    })
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
    return round(
      (payoutSplitPercent / ONE_BILLION) * 100,
      roundingPrecision,
    ).toString()
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
    newSplit: AddEditAllocationModalEntity & { projectOwner: false }
  }) {
    const newSplitPercent = parseFloat(newSplit.amount.value)
    let newSplitPercentPPB = (newSplitPercent * ONE_BILLION) / 100
    let adjustedSplits: Split[] = payoutSplits
    let newDistributionLimit = distributionLimit

    const isProject = newSplit.projectId && newSplit.projectId !== '0x00'

    // If amounts (!distributionLimitIsInfinite), handle changing DL and split %s
    if (!distributionLimitIsInfinite) {
      const newAmount = isProject
        ? newSplitPercent
        : deriveAmountBeforeFee(newSplitPercent)
      // Convert the newAmount to its percentage of the new DL in parts-per-bill
      newDistributionLimit = distributionLimit
        ? getNewDistributionLimit({
            currentDistributionLimit: distributionLimit.toString(),
            newSplitAmount: newAmount,
            editingSplitPercent: 0,
            ownerRemainingAmount,
          })
        : newAmount

      newSplitPercentPPB = round(
        (newAmount / (newDistributionLimit ?? 0)) * ONE_BILLION,
      )

      // recalculate all split percents based on newly added split amount
      if (newDistributionLimit && !distributionLimitIsInfinite) {
        adjustedSplits = adjustedSplitPercents({
          splits: payoutSplits,
          oldDistributionLimit: (distributionLimit as number).toString() ?? '0',
          newDistributionLimit: newDistributionLimit.toString(),
        })
      }
      _setDistributionLimit(newDistributionLimit)
    }

    const newPayoutSplit = {
      beneficiary: newSplit.beneficiary,
      percent: newSplitPercentPPB,
      preferClaimed: false,
      lockedUntil: newSplit.lockedUntil ?? 0,
      projectId: newSplit.projectId ?? '0x00',
      allocator: NULL_ALLOCATOR_ADDRESS,
    } as Split

    const newPayoutSplits = [...adjustedSplits, newPayoutSplit]

    _setPayoutSplits(newPayoutSplits)
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
    newPayoutSplit: AddEditAllocationModalEntity & { projectOwner: false }
  }) {
    let newSplit: Split = editedPayoutSplit
    // Find editedPayoutSplit in payoutSplits and change it to newPayoutSplit
    const newSplits = payoutSplits.map(m => {
      if (hasEqualRecipient(m, editedPayoutSplit)) {
        newSplit = {
          ...newSplit,
          beneficiary: newPayoutSplit.beneficiary,
          lockedUntil: newPayoutSplit.lockedUntil ?? 0,
          projectId: newPayoutSplit.projectId ?? '0x00',
        }
        // If percents (distributionLimitIsInfinite), further alterations to percentages are not needed.
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
    _setPayoutSplits(newSplits)
    if (!distributionLimitIsInfinite && !newPayoutSplit.projectOwner) {
      handlePayoutSplitAmountChanged({
        editingPayoutSplit: newSplit,
        newAmount: parseFloat(newPayoutSplit.amount.value),
        newSplits,
      })
    }
  }

  /**
   * Handle payoutSplit amount changed (called when payouts table rows' input fields update):
   *    - Sets new distributionLimit (DL) based on sum of new payout amounts
   *    - Changed the % of other splits based on the new DL keep their amount the same
   * @param editingPayoutSplit - Split that has had its amount changed
   * @param newAmount - The new amount of the @editingPayoutSplit
   * @param newSplits - (optional) pass new splits to adjust. If undefined, uses current @payoutSplits state
   */
  function handlePayoutSplitAmountChanged({
    editingPayoutSplit,
    newAmount,
    newSplits,
  }: {
    editingPayoutSplit: Split
    newAmount: number
    newSplits?: Split[]
  }) {
    const isNaN = Number.isNaN(newAmount)
    const _amount = isNaN
      ? 0
      : isProjectSplit(editingPayoutSplit)
      ? newAmount
      : deriveAmountBeforeFee(newAmount)
    // Convert the newAmount to its percentage of the new DL in parts-per-bill
    const newDistributionLimit =
      distributionLimit !== undefined
        ? getNewDistributionLimit({
            currentDistributionLimit: distributionLimit.toString(),
            newSplitAmount: _amount,
            editingSplitPercent: editingPayoutSplit.percent,
            ownerRemainingAmount,
          })
        : undefined // undefined means DL is infinite
    const newSplitPercentPPB = round(
      (_amount / (newDistributionLimit ?? 0)) * ONE_BILLION,
    )
    let adjustedSplits: Split[] = newSplits ?? payoutSplits
    // recalculate all split percents based on newly added split amount
    if (newDistributionLimit && !distributionLimitIsInfinite) {
      adjustedSplits = adjustedSplitPercents({
        splits: adjustedSplits,
        oldDistributionLimit: (distributionLimit as number).toString() ?? '0',
        newDistributionLimit: newDistributionLimit.toString(),
      })
    }

    const newPayoutSplit = {
      ...editingPayoutSplit,
      percent: newSplitPercentPPB,
    } as Split

    const newPayoutSplits = adjustedSplits.map(m => {
      return hasEqualRecipient(m, editingPayoutSplit)
        ? {
            ...m,
            ...newPayoutSplit,
          }
        : m
    })
    _setDistributionLimit(newDistributionLimit)
    _setPayoutSplits(newPayoutSplits)
  }

  /**
   * Handle payoutSplit amount deleted:
   *    - Deletes a payout split and adjusts the distributionLimit (DL) accordingly
   *    - Changed the % of other splits based on the new DL keep their amount the same
   * @param split - Split to be deleted
   */
  function handleDeletePayoutSplit({ payoutSplit }: { payoutSplit: Split }) {
    const newSplits = payoutSplits.filter(m => !isEqual(m, payoutSplit))

    let adjustedSplits: Split[] = newSplits
    let newDistributionLimit = distributionLimit
    if (distributionLimit && !distributionLimitIsInfinite) {
      const currentAmount = _derivePayoutAmount({
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

    _setDistributionLimit(newDistributionLimit)
    _setPayoutSplits(adjustedSplits)
  }

  function handleDeleteAllPayoutSplits() {
    setDistributionLimit?.(0)
    _setPayoutSplits([])
  }

  return {
    distributionLimit,
    distributionLimitIsInfinite,
    setDistributionLimit: _setDistributionLimit,
    currency,
    setCurrency,
    currencyOrPercentSymbol,
    payoutSplits,
    setPayoutSplits: _setPayoutSplits,
    setSplits100Percent,
    derivePayoutAmount: _derivePayoutAmount,
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
