import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { useHistorySubPanel } from '../hooks/useHistorySubPanel'
import { HistoricalConfigurationPanel } from './HistoricalConfigurationPanel'

export type HistoryData = {
  _metadata: {
    fundingCycle: V2V3FundingCycle
    metadata: V2V3FundingCycleMetadata
  }
  cycleNumber: string
  withdrawn: string
  date: string
}[]

export const HistorySubPanel = () => {
  const { loading, data, error } = useHistorySubPanel()
  const tableHeaders = [t`Cycle #`, t`Withdrawn`, t`Date`]

  return (
    <div className="grid min-w-full grid-cols-1">
      <div className="grid grid-cols-6 rounded-t-lg bg-smoke-50 dark:bg-slate-700">
        {tableHeaders.map((header, i) => (
          <div
            key={header}
            className={twMerge(
              'py-3 pl-4 pr-3 text-start text-sm font-semibold',
              `col-start-${2 * i + 1}`,
            )}
          >
            {header}
          </div>
        ))}
        <div className="relative py-3 pl-4 pr-3">
          <span className="sr-only">View</span>
        </div>
      </div>

      <div className="divide-y divide-grey-200 dark:divide-slate-500">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : error ? (
          <div className="text-error-400">{error}</div>
        ) : (
          <>
            {data.map(cycle => (
              <Disclosure key={cycle.cycleNumber} as={Fragment}>
                {({ open }) => (
                  <Disclosure.Button
                    data-testid={`disclosure-button-${cycle.cycleNumber}`}
                    as="div"
                    className="cursor-pointer py-4 pl-4 pr-3"
                  >
                    <div className="grid grid-cols-6 whitespace-nowrap text-sm font-medium">
                      <div>{cycle.cycleNumber}</div>
                      <div className="col-start-3 px-4">{cycle.withdrawn}</div>
                      <div className="col-start-5 px-4 text-grey-500 dark:text-slate-200">
                        {cycle.date}
                      </div>
                      <div className="text-gray-500 col-start-6 flex items-center justify-end whitespace-nowrap px-3 text-sm">
                        <ChevronDownIcon
                          className={twMerge(open && 'rotate-180', 'h-6 w-6')}
                        />
                      </div>
                    </div>
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
                        <HistoricalConfigurationPanel {...cycle._metadata} />
                      </Disclosure.Panel>
                    </Transition>
                  </Disclosure.Button>
                )}
              </Disclosure>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

const SkeletonRow = () => (
  <div className="grid animate-pulse grid-cols-6 bg-white dark:bg-slate-950">
    <div className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
      <div className="h-4 w-14 rounded bg-grey-200 dark:bg-slate-500"></div>
    </div>
    <div className="col-start-3 whitespace-nowrap px-4 py-4 text-sm font-medium">
      <div className="h-4 w-24 rounded bg-grey-200 dark:bg-slate-500"></div>
    </div>
    <div className="col-start-5 whitespace-nowrap px-4 py-4 text-sm text-grey-500">
      <div className="h-4 w-20 rounded bg-grey-200 dark:bg-slate-500"></div>
    </div>
  </div>
)
