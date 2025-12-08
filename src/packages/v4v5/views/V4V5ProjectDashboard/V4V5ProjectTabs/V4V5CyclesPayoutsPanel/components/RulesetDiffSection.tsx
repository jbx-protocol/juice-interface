import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'
import { Fragment, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { formattedNum } from 'utils/format/formatNumber'
import { timeSecondsToDateString } from 'utils/timeSecondsToDateString'

type RulesetDiffSectionProps = {
  currentRuleset: JBRulesetData | undefined
  currentMetadata: JBRulesetMetadata | undefined
  previousRuleset: JBRulesetData | undefined
  previousMetadata: JBRulesetMetadata | undefined
  previousCycleNumber: number
}

type DiffItem = {
  label: string
  currentValue: string
  previousValue: string
}

function formatDuration(duration: number | undefined): string {
  if (duration === undefined) return '-'
  if (duration === 0) return t`Not set`
  return timeSecondsToDateString(duration, 'short', 'lower')
}

function formatPercent(value: number | undefined): string {
  if (value === undefined) return '-'
  return `${formattedNum(value * 100)}%`
}

function formatWeight(weight: number | undefined, symbol: string = 'tokens/ETH'): string {
  if (weight === undefined) return '-'
  return `${formattedNum(weight)} ${symbol}`
}

function formatBoolean(value: boolean | undefined): string {
  if (value === undefined) return '-'
  return value ? t`Enabled` : t`Disabled`
}

function computeDiffs(
  current: JBRulesetData | undefined,
  currentMeta: JBRulesetMetadata | undefined,
  previous: JBRulesetData | undefined,
  previousMeta: JBRulesetMetadata | undefined,
): DiffItem[] {
  const diffs: DiffItem[] = []

  if (!current || !previous) return diffs

  // Duration
  if (current.duration !== previous.duration) {
    diffs.push({
      label: t`Duration`,
      currentValue: formatDuration(current.duration),
      previousValue: formatDuration(previous.duration),
    })
  }

  // Weight (token issuance)
  const currentWeight = current.weight.toFloat()
  const previousWeight = previous.weight.toFloat()
  if (currentWeight !== previousWeight) {
    diffs.push({
      label: t`Total issuance rate`,
      currentValue: formatWeight(currentWeight),
      previousValue: formatWeight(previousWeight),
    })
  }

  // Weight cut percent
  const currentWeightCut = current.weightCutPercent.toFloat()
  const previousWeightCut = previous.weightCutPercent.toFloat()
  if (currentWeightCut !== previousWeightCut) {
    diffs.push({
      label: t`Issuance cut percent`,
      currentValue: formatPercent(currentWeightCut),
      previousValue: formatPercent(previousWeightCut),
    })
  }

  // Metadata comparisons
  if (currentMeta && previousMeta) {
    // Reserved percent
    const currentReserved = currentMeta.reservedPercent.toFloat()
    const previousReserved = previousMeta.reservedPercent.toFloat()
    if (currentReserved !== previousReserved) {
      diffs.push({
        label: t`Reserved rate`,
        currentValue: formatPercent(currentReserved),
        previousValue: formatPercent(previousReserved),
      })
    }

    // Cash out tax rate
    const currentCashOut = currentMeta.cashOutTaxRate.toFloat()
    const previousCashOut = previousMeta.cashOutTaxRate.toFloat()
    if (currentCashOut !== previousCashOut) {
      diffs.push({
        label: t`Cash out tax rate`,
        currentValue: formatPercent(currentCashOut),
        previousValue: formatPercent(previousCashOut),
      })
    }

    // Pause pay
    if (currentMeta.pausePay !== previousMeta.pausePay) {
      diffs.push({
        label: t`Payments`,
        currentValue: formatBoolean(!currentMeta.pausePay),
        previousValue: formatBoolean(!previousMeta.pausePay),
      })
    }

    // Allow owner minting
    if (currentMeta.allowOwnerMinting !== previousMeta.allowOwnerMinting) {
      diffs.push({
        label: t`Owner token minting`,
        currentValue: formatBoolean(currentMeta.allowOwnerMinting),
        previousValue: formatBoolean(previousMeta.allowOwnerMinting),
      })
    }

    // Token transfers
    if (currentMeta.pauseCreditTransfers !== previousMeta.pauseCreditTransfers) {
      diffs.push({
        label: t`Token transfers`,
        currentValue: formatBoolean(!currentMeta.pauseCreditTransfers),
        previousValue: formatBoolean(!previousMeta.pauseCreditTransfers),
      })
    }

    // Terminal migration
    if (currentMeta.allowTerminalMigration !== previousMeta.allowTerminalMigration) {
      diffs.push({
        label: t`Terminal migration`,
        currentValue: formatBoolean(currentMeta.allowTerminalMigration),
        previousValue: formatBoolean(previousMeta.allowTerminalMigration),
      })
    }

    // Controller migration
    if (currentMeta.allowSetController !== previousMeta.allowSetController) {
      diffs.push({
        label: t`Controller migration`,
        currentValue: formatBoolean(currentMeta.allowSetController),
        previousValue: formatBoolean(previousMeta.allowSetController),
      })
    }

    // Hold fees
    if (currentMeta.holdFees !== previousMeta.holdFees) {
      diffs.push({
        label: t`Hold fees`,
        currentValue: formatBoolean(currentMeta.holdFees),
        previousValue: formatBoolean(previousMeta.holdFees),
      })
    }
  }

  return diffs
}

function DiffRow({ item }: { item: DiffItem }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-grey-600 dark:text-slate-300">{item.label}</span>
      <div className="flex items-center gap-2">
        <span className="text-grey-400 line-through dark:text-slate-500">
          {item.previousValue}
        </span>
        <span className="text-grey-500 dark:text-slate-400">→</span>
        <span className="font-medium text-grey-900 dark:text-slate-100">
          {item.currentValue}
        </span>
      </div>
    </div>
  )
}

export function RulesetDiffSection({
  currentRuleset,
  currentMetadata,
  previousRuleset,
  previousMetadata,
  previousCycleNumber,
}: RulesetDiffSectionProps) {
  const diffs = useMemo(
    () => computeDiffs(currentRuleset, currentMetadata, previousRuleset, previousMetadata),
    [currentRuleset, currentMetadata, previousRuleset, previousMetadata],
  )

  if (diffs.length === 0) {
    return null
  }

  return (
    <Disclosure
      as="div"
      className="mt-4 rounded-lg border border-smoke-200 bg-smoke-25 dark:border-slate-600 dark:bg-slate-800"
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center justify-between px-4 py-3 text-left">
            <span className="text-sm font-medium text-grey-700 dark:text-slate-200">
              <Trans>
                Changes from Cycle #{previousCycleNumber}
              </Trans>
              <span className="ml-2 text-grey-500 dark:text-slate-400">
                ({diffs.length} {diffs.length === 1 ? t`change` : t`changes`})
              </span>
            </span>
            <ChevronDownIcon
              className={twMerge(
                'h-5 w-5 text-grey-500 transition-transform dark:text-slate-400',
                open && 'rotate-180',
              )}
            />
          </Disclosure.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition-all ease-in-out duration-200"
            enterFrom="max-h-0 overflow-hidden opacity-0"
            enterTo="max-h-[500px] overflow-hidden opacity-100"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="max-h-[500px] overflow-hidden opacity-100"
            leaveTo="max-h-0 overflow-hidden opacity-0"
          >
            <Disclosure.Panel className="border-t border-smoke-200 px-4 dark:border-slate-600">
              <div className="divide-y divide-smoke-100 dark:divide-slate-700">
                {diffs.map((diff, index) => (
                  <DiffRow key={index} item={diff} />
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
