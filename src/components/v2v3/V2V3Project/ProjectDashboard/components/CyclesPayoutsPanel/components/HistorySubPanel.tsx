import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/v2v3/V2V3Project/ProjectDashboard/hooks'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber, Contract } from 'ethers'
import {
  FundingCycle_OrderBy,
  OrderDirection,
  useFundingCyclesQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import moment from 'moment'
import { Fragment, useContext, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { isBigNumberish } from 'utils/bigNumbers'
import { callContract } from 'utils/callContract'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import {
  sgFCToV2V3FundingCycle,
  sgFCToV2V3FundingCycleMetadata,
} from 'utils/v2v3/fundingCycle'
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

const pageSize = 5

export const HistorySubPanel = () => {
  const { projectId } = useProjectMetadata()

  const [isFetchingMore, setIsFetchingMore] = useState<boolean>()
  const { data, fetchMore, loading, error } = useFundingCyclesQuery({
    client,
    variables: {
      where: { projectId },
      orderBy: FundingCycle_OrderBy.number,
      orderDirection: OrderDirection.desc,
      first: pageSize,
      skip: 1, // skip current cycle
    },
  })

  const isLoading = loading || isFetchingMore

  const tableHeaders = [t`Cycle #`, t`Withdrawn`, t`Date`]
  const hasMore =
    data && data.fundingCycles[data.fundingCycles.length - 1].number > 1

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
                        <FormattedWithdrawnAmount {...cycle} />
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
                    setIsFetchingMore(true)
                    fetchMore({
                      variables: {
                        skip: data?.fundingCycles.length + 1,
                      },
                    }).finally(() => setIsFetchingMore(false))
                  }}
                >
                  <Trans>Load more</Trans>
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
  const { projectId } = useProjectMetadata()
  const { primaryETHTerminal } = useProjectContext()
  const {
    contracts,
    versions: { JBControllerVersion },
  } = useContext(V2V3ProjectContractsContext)

  const [currencyOption, setCurrencyOption] = useState<V2V3CurrencyOption>()

  const terminal = primaryETHTerminal
  const { JBController, JBFundAccessConstraintsStore } = contracts
  const contract =
    JBControllerVersion === V2V3ContractName.JBController3_1
      ? JBFundAccessConstraintsStore
      : JBController

  useEffect(() => {
    callContract({
      contract,
      contracts: contracts as Record<string, Contract>,
      functionName: 'distributionLimitOf',
      args:
        projectId && configuration && terminal && contract
          ? [projectId, configuration.toString(), terminal, ETH_TOKEN_ADDRESS]
          : null,
    }).then(result => {
      if (typeof result === undefined) return
      if (!(Array.isArray(result) && result.length === 2)) {
        console.error('Unexpected result from distributionLimitOf', result)
        throw new Error('Unexpected result from distributionLimitOf')
      }
      const [, currency] = result
      if (!isBigNumberish(currency)) {
        console.error('Unexpected result from distributionLimitOf', result)
        throw new Error('Unexpected result from distributionLimitOf')
      }
      const _currencyOption = BigNumber.from(currency).toNumber()
      if (_currencyOption === 0) {
        setCurrencyOption(undefined)
      } else {
        setCurrencyOption(_currencyOption as V2V3CurrencyOption)
      }
    })
  }, [projectId, configuration, terminal, contract, contracts])

  return (
    <span>
      {formatCurrencyAmount({
        amount: fromWad(withdrawnAmount),
        currency: currencyOption,
      }) ?? '0Ξ'}
    </span>
  )
}
