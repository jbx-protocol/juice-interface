import { SplitPortion } from 'juice-sdk-core'
import { useJBChainId, useJBContractContext, useSuckers } from 'juice-sdk-react'
import {
  AnyEvent,
  EventType,
  transformEventData,
} from './utils/transformEventsData'
// import { groupEventsByTransaction } from './utils/groupEvents'

import { Button } from 'antd'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import Loading from 'components/Loading'
import RichNote from 'components/RichNote/RichNote'
import { NETWORKS } from 'constants/networks'
import { useActivityEventsQuery, useProjectQuery } from 'generated/v4v5/graphql'
import { getBendystrawClient } from 'lib/apollo/bendystrawClient'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import React, { useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { formatActivityAmount } from 'utils/format/formatActivityAmount'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { ActivityEvent } from './activityEventElems/ActivityElement'

const PAGE_SIZE = 10

const IGNORED_EVENTS = ['mintNftEvent']

const baseEventFilter = IGNORED_EVENTS.reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: null,
  }),
  {},
)

export function V4V5ActivityList() {
  const tokenSymbol = useProjectContext().tokenSymbol
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { data: suckers, isLoading: suckersLoading } = useSuckers()
  const { version } = useV4V5Version()

  const [endCursor, setEndCursor] = useState<string | null>(null)

  const [filter, setFilter] = React.useState<ProjectEventFilter>('all')

  // Load the bendystraw project to get its suckerGroupId
  const { data: project } = useProjectQuery({
    client: getBendystrawClient(chainId),
    variables: {
      chainId: Number(chainId),
      projectId: Number(projectId),
      version: version
    },
    skip: !chainId || !projectId,
  })

  const { data: activityEvents, loading } = useActivityEventsQuery({
    client: getBendystrawClient(chainId),
    skip: !project?.project?.suckerGroupId,
    variables: {
      where: {
        suckerGroupId: project?.project?.suckerGroupId,
        ...(filter === 'all'
          ? baseEventFilter
          : { ...baseEventFilter, [`${filter}_not`]: null }),
      },
      orderBy: 'timestamp',
      orderDirection: 'desc',
      after: endCursor,
      limit: PAGE_SIZE,
    },
  })

  const projectEvents = React.useMemo(
    () => {
      if (!activityEvents?.activityEvents.items) return []

      // TODO: Event grouping temporarily disabled
      // const groupedEvents = groupEventsByTransaction(activityEvents.activityEvents.items)

      // Transform and present events
      return activityEvents.activityEvents.items
        .map(transformEventData)
        .filter((event): event is AnyEvent => !!event)
        .map(e => translateEventDataToPresenter(e, tokenSymbol))
    },
    [activityEvents?.activityEvents.items, tokenSymbol],
  )

  return (
    <div>
      <h2 className="mb-6 font-heading text-2xl font-medium">Activity</h2>
      <div className="flex flex-col gap-3">
        <JuiceListbox
          className="mb-5"
          options={ACTIVITY_OPTIONS}
          value={ACTIVITY_OPTIONS.find(o => o.value === filter)}
          onChange={o => setFilter(o.value as ProjectEventFilter)}
        />
        {(loading || suckersLoading) && <Loading />}
        {loading ||
        suckersLoading ||
        (projectEvents && projectEvents.length > 0) ? (
          <>
            {projectEvents?.map(event => {
              return (
                <div
                  className="border-smoke-200 pb-5 dark:border-grey-600 [&:not(:last-child)]:mb-5 [&:not(:last-child)]:border-b"
                  key={event.event.id}
                >
                  <ActivityEvent
                    event={event.event}
                    header={event.header}
                    subject={event.subject}
                    extra={event.extra}
                  />
                </div>
              )
            })}
            {activityEvents?.activityEvents.pageInfo.hasNextPage && (
              <Button
                onClick={() =>
                  setEndCursor(activityEvents.activityEvents.pageInfo.endCursor)
                }
              >
                Load more
              </Button>
            )}
          </>
        ) : (
          <span className="text-zinc-500 text-sm">No activity yet.</span>
        )}
      </div>
    </div>
  )
}

// TODO this should be exported from somewhere else. Components are currently awkward due to shared dependencies on v1v2v3 and v4 parts
export function translateEventDataToPresenter(
  event: AnyEvent,
  tokenSymbol: string | undefined,
) {
  switch (event.type) {
    case 'payEvent':
      return {
        event,
        header: 'Paid',
        subject: (
          <span className="font-heading text-lg">
            {formatActivityAmount(event.amount.value)} ETH
          </span>
        ),
        extra: <RichNote note={event.note} />,
      }
    case 'addToBalanceEvent':
      return {
        event,
        header: 'Added to balance',
        subject: (
          <span className="font-heading text-lg">
            {formatActivityAmount(event.amount.value)} ETH
          </span>
        ),
        extra: event.note ? <RichNote note={event.note} /> : null,
      }
    case 'mintTokensEvent':
      return {
        event,
        header: 'Minted tokens',
        subject: (
          <span className="font-heading text-lg">
            {event.amount.format()}{' '}
            {tokenSymbolText({
              capitalize: true,
              tokenSymbol,
              plural: event.amount.toFloat() > 1,
            })}
          </span>
        ),
        extra: <RichNote note={event.note} />,
      }
    case 'cashOutEvent':
      return {
        event,
        header: 'Cashed out',
        subject: (
          <span className="font-heading text-lg">
            {formatActivityAmount(event.reclaimAmount.value)} ETH
          </span>
        ),
      }
    case 'deployedERC20Event':
      return {
        event,
        header: 'Deployed ERC20',
        subject: <span className="font-heading text-lg">{event.symbol}</span>,
        extra: <RichNote note={event.address} />,
      }
    case 'projectCreateEvent':
      return {
        event,
        header: 'Created',
        subject: 'Project created 🎉',
        extra: null,
      }
    case 'distributePayoutsEvent':
      return {
        event,
        header: 'Send payouts',
        subject: (
          <span className="font-heading text-lg">
            {formatActivityAmount(event.amount.value)} ETH
          </span>
        ),
        extra: (
          <RichNote
            note={`Paid out: Ξ${formatActivityAmount(event.amountPaidOut.value)}, Fee: Ξ${formatActivityAmount(event.fee.value)}`}
          />
        ),
      }
    case 'distributeReservedTokensEvent':
      return {
        event,
        header: 'Send reserved tokens',
        subject: (
          <span className="font-heading text-lg">
            {fromWad(event.tokenCount)}{' '}
            {tokenSymbolText({ tokenSymbol, plural: event.tokenCount > 1 })}
          </span>
        ),
        extra: null,
      }
    case 'distributeToReservedTokenSplitEvent':
      return {
        event,
        header: 'Send to reserved token split',
        subject: (
          <span className="font-heading text-lg">
            {fromWad(event.tokenCount)}{' '}
            {tokenSymbolText({ tokenSymbol, plural: event.tokenCount > 1 })}
          </span>
        ),
        extra: (
          <RichNote
            note={`Percent: ${new SplitPortion(
              event.percent,
            ).formatPercentage()}%, Split project: ${event.splitProjectId}`}
          />
        ),
      }
    case 'distributeToPayoutSplitEvent':
      return {
        event,
        header: 'Send to payout split',
        subject: (
          <span className="font-heading text-lg">
            {formatActivityAmount(event.amount.value)} ETH
          </span>
        ),
        extra: (
          <RichNote
            note={`Percent: ${new SplitPortion(
              event.percent,
            ).formatPercentage()}%, Split project: ${event.splitProjectId}`}
          />
        ),
      }
    case 'useAllowanceEvent':
      return {
        event,
        header: 'Used allowance',
        subject: (
          <span className="font-heading text-lg">
            {formatActivityAmount(event.amount.value)} ETH
          </span>
        ),
        extra: <RichNote note={event.note} />,
      }
    case 'burnEvent':
      return {
        event,
        header: 'Burned',
        subject: (
          <span className="font-heading text-lg">
            {Number(event.amount.toFloat())}{' '}
            {tokenSymbolText({
              tokenSymbol,
              plural: event.amount.toFloat() > 1,
            })}
          </span>
        ),
        extra: (
          <RichNote
            note={`Staked: ${formatActivityAmount(event.stakedAmount.value)}, ERC20: ${formatActivityAmount(event.erc20Amount.value)}`}
          />
        ),
      }
    // TODO: Aggregated Events - temporarily disabled until event grouping is implemented
    // case 'paymentEvent':
    //   return {
    //     event,
    //     header: 'Payment',
    //     subject: (
    //       <span className="font-heading text-lg">
    //         <AmountInCurrency
    //           amount={BigNumber.from(event.amountPaid.value)}
    //           currency="ETH"
    //           hideTooltip
    //         />
    //         {' → '}
    //         {event.tokensMinted.format()}{' '}
    //         {tokenSymbolText({
    //           capitalize: true,
    //           tokenSymbol,
    //           plural: event.tokensMinted.toFloat() > 1,
    //         })}
    //       </span>
    //     ),
    //     extra: event.note ? <RichNote note={event.note} /> : null,
    //   }
    // case 'cashOutAggregatedEvent':
    //   return {
    //     event,
    //     header: 'Cash out',
    //     subject: (
    //       <span className="font-heading text-lg">
    //         {Number(event.tokensBurned.toFloat())}{' '}
    //         {tokenSymbolText({
    //           tokenSymbol,
    //           plural: event.tokensBurned.toFloat() > 1,
    //         })}
    //         {' → '}
    //         <AmountInCurrency
    //           amount={BigNumber.from(event.ethReceived.value)}
    //           currency="ETH"
    //           hideTooltip
    //         />
    //       </span>
    //     ),
    //     extra: (
    //       <RichNote
    //         note={`Tokens burned: ${fromWad(event.tokensBurned.value)} (Staked: ${fromWad(
    //           event.stakedAmount.value,
    //         )}, ERC20: ${fromWad(event.erc20Amount.value)})`}
    //       />
    //     ),
    //   }
    // case 'erc20CreationEvent':
    //   return {
    //     event,
    //     header: 'ERC-20 token created',
    //     subject: <span className="font-heading text-lg">{event.symbol}</span>,
    //     extra: (
    //       <RichNote
    //         note={`Deployed on ${event.chains.length} chain${
    //           event.chains.length > 1 ? 's' : ''
    //         }: ${event.chains.map(c => NETWORKS[c.chainId]?.label || `Chain ${c.chainId}`).join(', ')}`}
    //       />
    //     ),
    //   }
    // case 'payoutDistributionEvent':
    //   return {
    //     event,
    //     header: 'Payouts distributed',
    //     subject: (
    //       <span className="font-heading text-lg">
    //         <AmountInCurrency
    //           amount={BigNumber.from(event.totalAmount.value)}
    //           currency="ETH"
    //           hideTooltip
    //         />
    //         {event.numberOfSplits > 0 && ` to ${event.numberOfSplits} split${event.numberOfSplits > 1 ? 's' : ''}`}
    //       </span>
    //     ),
    //     extra: (
    //       <RichNote
    //         note={`Paid out: Ξ${event.amountPaidOut.format()}, Fee: Ξ${event.fee.format()}, Cycle: ${event.rulesetCycleNumber}`}
    //       />
    //     ),
    //   }
    // case 'reservedTokenDistributionEvent':
    //   return {
    //     event,
    //     header: 'Reserved tokens distributed',
    //     subject: (
    //       <span className="font-heading text-lg">
    //         {fromWad(event.totalTokens)}{' '}
    //         {tokenSymbolText({ tokenSymbol, plural: event.totalTokens > 1 })}
    //         {event.numberOfSplits > 0 && ` to ${event.numberOfSplits} split${event.numberOfSplits > 1 ? 's' : ''}`}
    //       </span>
    //     ),
    //     extra: <RichNote note={`Cycle: ${event.rulesetCycleNumber}`} />,
    //   }
  }
}

type ProjectEventFilter = 'all' | EventType

const ACTIVITY_OPTIONS = [
  { label: 'All activity', value: 'all' },
  { label: 'Paid', value: 'payEvent' },
  { label: 'Added to balance', value: 'addToBalanceEvent' },
  { label: 'Minted tokens', value: 'mintTokensEvent' },
  { label: 'Cashed out', value: 'cashOutEvent' },
  { label: 'Deployed ERC20', value: 'deployedERC20Event' },
  { label: 'Project created', value: 'projectCreateEvent' },
  { label: 'Send payouts', value: 'sendPayoutsEvent' },
  {
    label: 'Send reserved tokens',
    value: 'sendReservedTokensToSplitsEvent',
  },
  {
    label: 'Send to reserved token split',
    value: 'sendReservedTokensToSplitEvent',
  },
  {
    label: 'Send to payout split',
    value: 'sendPayoutsToSplitEvent',
  },
  { label: 'Used allowance', value: 'useAllowanceEvent' },
  { label: 'Burned', value: 'burnEvent' },
]

const CHAIN_OPTIONS = Object.entries(NETWORKS).map(
  ([chainId, networkInfo]) => ({
    label: networkInfo.label,
    value: parseInt(chainId),
  }),
)

// TODO: Chain options as icons
// const Chain: React.FC<PropsWithChildren> = ({ children }) => {
//   return (
//     <div className="flex h-6 w-6 items-center justify-center">{children}</div>
//   )
// }

// const CHAIN_OPTIONS = [
//   {
//     label: (
//       <Chain>
//         <EthereumLogo />
//       </Chain>
//     ),
//     value: 'ethereum' as const,
//   },
//   {
//     label: (
//       <Chain>
//         <OptimismLogoIcon />
//       </Chain>
//     ),
//     value: 'optimism' as const,
//   },
//   {
//     label: (
//       <Chain>
//         <ArbitrumLogoIcon />
//       </Chain>
//     ),
//     value: 'arbitrum' as const,
//   },
//   {
//     label: (
//       <Chain>
//         <BaseLogoIcon />
//       </Chain>
//     ),
//     value: 'base' as const,
//   },
// ]
