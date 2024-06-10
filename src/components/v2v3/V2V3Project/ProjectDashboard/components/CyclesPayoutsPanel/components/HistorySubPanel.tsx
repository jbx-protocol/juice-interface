import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import moment from 'moment'
import { Fragment, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { isBigNumberish } from 'utils/bigNumbers'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad } from 'utils/format/formatNumber'
import {
  sgFCToV2V3FundingCycle,
  sgFCToV2V3FundingCycleMetadata,
} from 'utils/v2v3/fundingCycle'
import { usePastFundingCycles } from '../hooks/usePastFundingCycles'
import { HistoricalConfigurationPanel } from './HistoricalConfigurationPanel'

export const HistorySubPanel = () => {
  const { projectId } = useProjectMetadataContext()
  const { fundingCycle } = useProjectContext()

  const [skip, setSkip] = useState<number>(0)
  const { data, isLoading, error } = usePastFundingCycles({
    projectId,
    currentFcNumber: fundingCycle?.number.toNumber() ?? 0,
    skip,
  })

  const tableHeaders = [t`Cycle #`, t`Withdrawn`, t`Date`]
  const hasMore =
    data?.fundingCycles.length &&
    data.fundingCycles[data.fundingCycles.length - 1].number > 1

  return data?.fundingCycles.length || isLoading ? (
    <div className="grid min-w-full grid-cols-1">
      <div className="rounded-t-lg bg-smoke-50 p-4 pr-2 dark:bg-slate-700">
        <div className="grid grid-cols-config-table gap-3">
          {tableHeaders.map(header => (
            <div
              key={header}
              className={twMerge('text-start text-sm font-semibold')}
            >
              {header}
            </div>
          ))}
          <div className="relative w-6 min-w-[24px] py-2.5">
            <span className="sr-only">View</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-grey-200 dark:divide-slate-500">
        {error ? (
          <div className="text-error-400">{error.message}</div>
        ) : (
          <>
            {data?.fundingCycles.map(cycle => (
              <Disclosure key={cycle.number} as={Fragment}>
                {({ open }) => (
                  <div className="p-4 pr-2">
                    <Disclosure.Button
                      data-testid={`disclosure-button-${cycle.number}`}
                      as="div"
                      className="grid cursor-pointer grid-cols-config-table gap-3 whitespace-nowrap text-sm font-medium"
                    >
                      <div>#{cycle.number}</div>
                      <div>
                        {isBigNumberish(cycle.configuration) &&
                        isBigNumberish(cycle.withdrawnAmount) ? (
                          <FormattedWithdrawnAmount
                            configuration={BigNumber.from(cycle.configuration)}
                            withdrawnAmount={BigNumber.from(
                              cycle.withdrawnAmount,
                            )}
                          />
                        ) : null}
                      </div>
                      <div className="text-grey-500 dark:text-slate-200">
                        {`${moment(
                          (cycle.startTimestamp + cycle.duration) * 1000,
                        ).fromNow(true)} ago`}
                      </div>
                      <div className="text-gray-500 flex items-center justify-end whitespace-nowrap text-sm">
                        <ChevronDownIcon
                          className={twMerge(open && 'rotate-180', 'h-5 w-5')}
                        />
                      </div>
                    </Disclosure.Button>
                    <Transition
                      show={open}
                      as={Fragment}
                      enter="transition-all ease-in-out duration-300"
                      enterFrom="max-h-0 overflow-hidden opacity-0"
                      enterTo="max-h-[1000px] overflow-hidden opacity-100"
                      leave="transition-all ease-in-out duration-300"
                      leaveFrom="max-h-[1000px] overflow-hidden opacity-100"
                      leaveTo="max-h-0 overflow-hidden opacity-0"
                    >
                      <Disclosure.Panel className="p-4">
                        <HistoricalConfigurationPanel
                          fundingCycle={sgFCToV2V3FundingCycle(cycle)}
                          metadata={sgFCToV2V3FundingCycleMetadata(cycle)}
                        />
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            ))}
            {isLoading ? (
              <LoadingState />
            ) : (
              hasMore && (
                <Button
                  type="link"
                  onClick={() => {
                    setSkip(data?.fundingCycles.length + 1)
                  }}
                >
                  <Trans>Load more...</Trans>
                </Button>
              )
            )}
          </>
        )}
      </div>
    </div>
  ) : (
    <div className="text-grey-500 dark:text-slate-200">
      <Trans>No previous cycles.</Trans>
    </div>
  )
}

const LoadingState = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </>
)

const SkeletonRow = () => (
  <div className="p-4 pr-2">
    <div className="grid animate-pulse grid-cols-config-table bg-white dark:bg-slate-950">
      <div className="whitespace-nowrap text-sm font-medium">
        <div className="h-4 w-14 rounded bg-grey-200 dark:bg-slate-500"></div>
      </div>
      <div className="whitespace-nowrap text-sm font-medium">
        <div className="h-4 w-24 rounded bg-grey-200 dark:bg-slate-500"></div>
      </div>
      <div className="whitespace-nowrap text-sm text-grey-500">
        <div className="h-4 w-20 rounded bg-grey-200 dark:bg-slate-500"></div>
      </div>
      <div className="relative w-6 min-w-[24px] py-2.5"></div>
    </div>
  </div>
)

/**
 * Component to get the currency for a specific funding cycle, and render its formatted withdrawnAmount in that currency
 */
function FormattedWithdrawnAmount({
  configuration,
  withdrawnAmount,
}: {
  configuration: BigNumber
  withdrawnAmount: BigNumber
}) {
  const { projectId } = useProjectMetadataContext()
  const { primaryETHTerminal } = useProjectContext()

  const { data: distributionLimit } = useProjectDistributionLimit({
    projectId,
    configuration: configuration.toString(),
    terminal: primaryETHTerminal,
  })

  const currencyOption = useMemo(() => {
    if (typeof distributionLimit === 'undefined') return

    if (!(Array.isArray(distributionLimit) && distributionLimit.length === 2)) {
      console.error(
        'Unexpected result from distributionLimitOf',
        distributionLimit,
      )
      throw new Error('Unexpected result from distributionLimitOf')
    }

    const [, currency] = distributionLimit

    if (!isBigNumberish(currency)) {
      console.error(
        'Unexpected result from distributionLimitOf',
        distributionLimit,
      )
      throw new Error('Unexpected result from distributionLimitOf')
    }
    const _currencyOption = BigNumber.from(currency).toNumber()
    if (_currencyOption !== 0) return _currencyOption as V2V3CurrencyOption
  }, [distributionLimit])

  return (
    <span>
      {formatCurrencyAmount({
        amount: fromWad(withdrawnAmount),
        currency: currencyOption,
      }) ?? '0Ξ'}
    </span>
  )
}
