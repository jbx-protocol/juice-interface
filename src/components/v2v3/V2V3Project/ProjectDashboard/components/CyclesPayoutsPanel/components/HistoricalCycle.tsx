import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { BigNumber } from 'ethers'
import { FundingCyclesQuery } from 'generated/graphql'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import moment from 'moment'
import React, { Fragment, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { isBigNumberish } from 'utils/bigNumbers'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import {
  sgFCToV2V3FundingCycle,
  sgFCToV2V3FundingCycleMetadata,
} from 'utils/v2v3/fundingCycle'
import { useProjectContext } from '../../../hooks/useProjectContext'
import { HistoricalConfigurationPanel } from './HistoricalConfigurationPanel'

type QueriedFundingCycle = FundingCyclesQuery['fundingCycles'][number]

const HistoricalCycle: React.FC<QueriedFundingCycle> = cycle => {
  const { projectId } = useProjectMetadataContext()
  const { primaryETHTerminal } = useProjectContext()

  const { data: distributionLimit } = useProjectDistributionLimit({
    projectId,
    configuration: cycle.configuration.toString(),
    terminal: primaryETHTerminal,
  })
  const currency =
    useMemo(() => {
      if (typeof distributionLimit === 'undefined') return

      if (
        !(Array.isArray(distributionLimit) && distributionLimit.length === 2)
      ) {
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
    }, [distributionLimit]) ?? V2V3_CURRENCY_ETH

  const withdrawnAmountAndCurrency = {
    amount: parseFloat(fromWad(cycle.withdrawnAmount)),
    currency: currency,
  }

  return (
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
              <span>
                {formatCurrencyAmount(withdrawnAmountAndCurrency) ?? '0'}
              </span>
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
                withdrawnAmountAndCurrency={withdrawnAmountAndCurrency}
              />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}

export default HistoricalCycle
