import { SplitPortion } from 'juice-sdk-core'
import { useJBChainId, useJBContractContext, useSuckers } from 'juice-sdk-react'
import {
  AnyEvent,
  EventType,
  transformEventData,
} from './utils/transformEventsData'

import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import Loading from 'components/Loading'
import RichNote from 'components/RichNote/RichNote'
import { NETWORKS } from 'constants/networks'
import { useActivityEventsQuery, useProjectQuery } from 'generated/v4/graphql'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import React, { useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { ActivityEvent } from './activityEventElems/ActivityElement'

const PAGE_SIZE = 10

export function V4ActivityList() {
  const tokenSymbol = useProjectContext().tokenSymbol
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { data: suckers, isLoading: suckersLoading } = useSuckers()

  const [endCursor, setEndCursor] = useState<string | null>(null)

  const [filter, setFilter] = React.useState<ProjectEventFilter>('all')

  // Load the bendystraw project to get its suckerGroupId
  const { data: project } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      chainId: Number(chainId),
      projectId: Number(projectId),
    },
    skip: !chainId || !projectId,
  })

  const { data: activityEvents, loading } = useActivityEventsQuery({
    client: bendystrawClient,
    skip: !project?.project?.suckerGroupId,
    variables: {
      where: {
        suckerGroupId: project?.project?.suckerGroupId,
        ...(filter === 'all' ? {} : { [`${filter}_not`]: null }),
      },
      orderBy: 'timestamp',
      orderDirection: 'desc',
      after: endCursor,
      limit: PAGE_SIZE,
    },
  })

  const projectEvents = React.useMemo(
    () =>
      activityEvents?.activityEvents.items
        .map(transformEventData)
        .filter((event): event is AnyEvent => !!event)
        .map(e => translateEventDataToPresenter(e, tokenSymbol)) ?? [],
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

function translateEventDataToPresenter(
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
            <AmountInCurrency
              amount={BigNumber.from(event.amount.value)}
              currency="ETH"
              hideTooltip
            />
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
            <AmountInCurrency
              amount={BigNumber.from(event.amount.value)}
              currency="ETH"
              hideTooltip
            />
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
            <AmountInCurrency
              amount={BigNumber.from(event.reclaimAmount.value)}
              currency="ETH"
              hideTooltip
            />
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
            <AmountInCurrency
              amount={BigNumber.from(event.amount.value)}
              currency="ETH"
              hideTooltip
            />
          </span>
        ),
        extra: (
          <RichNote
            note={`Paid out: Ξ${event.amountPaidOut.format()}, Fee: Ξ${event.fee.format()}`}
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
            <AmountInCurrency
              amount={BigNumber.from(event.amount.value)}
              currency="ETH"
              hideTooltip
            />
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
            <AmountInCurrency
              amount={BigNumber.from(event.amount.value)}
              currency="ETH"
              hideTooltip
            />
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
            note={`Staked: ${fromWad(
              event.stakedAmount.value,
            )}, ERC20: ${fromWad(event.erc20Amount.value)}`}
          />
        ),
      }
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
