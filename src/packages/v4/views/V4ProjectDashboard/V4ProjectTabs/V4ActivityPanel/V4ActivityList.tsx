import { useInfiniteQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import Loading from 'components/Loading'
import RichNote from 'components/RichNote/RichNote'
import { NETWORKS } from 'constants/networks'
import request from 'graphql-request'
import { JBChainId, SuckerPair } from 'juice-sdk-core'
import { NativeTokenValue, useJBChainId, useSuckers } from 'juice-sdk-react'
import { v4SubgraphUri } from 'lib/apollo/subgraphUri'
import { last } from 'lodash'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import {
  OrderDirection,
  ProjectEvent_OrderBy,
  ProjectEventsDocument,
} from 'packages/v4/graphql/client/graphql'
import React from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { ActivityEvent } from './activityEventElems/ActivityElement'
import {
  AnyEvent,
  EventType,
  transformEventData,
} from './utils/transformEventsData'

const PAGE_SIZE = 10

export function V4ActivityList() {
  const tokenSymbol = useProjectContext().tokenSymbol
  const chainId = useJBChainId()
  const { data: suckers, isLoading: suckersLoading } = useSuckers()

  const [selectedChainId, setSelectedChainId] = React.useState(chainId)
  const [filter, setFilter] = React.useState<ProjectEventFilter>('all')

  const supportedChains = React.useMemo(
    () =>
      CHAIN_OPTIONS.filter(o => suckers?.find(s => s.peerChainId === o.value)),
    [suckers],
  )

  const {
    data: projectEventsQueryResult,
    isLoading,
    fetchNextPage,
  } = useOmnichainSubgraphProjectQuery({
    sucker: suckers?.find(s => s.peerChainId === selectedChainId),
    filter,
  })

  const projectEvents = React.useMemo(
    () =>
      projectEventsQueryResult?.pages
        .flatMap(page => page.data.projectEvents)
        .map(transformEventData)
        .filter((event): event is AnyEvent => !!event)
        .map(e => translateEventDataToPresenter(e, tokenSymbol)) ?? [],
    [projectEventsQueryResult?.pages, tokenSymbol],
  )

  return (
    <div>
      <div className="flex items-baseline justify-between gap-5">
        <h2 className="mb-6 font-heading text-2xl font-medium">Activity</h2>
        <JuiceListbox
          className="w-full min-w-0 max-w-[224px]"
          value={CHAIN_OPTIONS.find(o => o.value === selectedChainId)}
          options={supportedChains}
          onChange={o => setSelectedChainId(o.value as JBChainId)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <JuiceListbox
          className="mb-5"
          options={ACTIVITY_OPTIONS}
          value={ACTIVITY_OPTIONS.find(o => o.value === filter)}
          onChange={o => setFilter(o.value as ProjectEventFilter)}
        />
        {(isLoading || suckersLoading) && <Loading />}
        {isLoading ||
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
            {!!last(projectEventsQueryResult?.pages)?.nextCursor && (
              <Button onClick={() => fetchNextPage()}>Load more</Button>
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
            <NativeTokenValue decimals={8} wei={event.amount.value} />
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
            <NativeTokenValue decimals={8} wei={event.amount.value} />
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
            <NativeTokenValue decimals={8} wei={event.reclaimAmount.value} />
          </span>
        ),
        extra: <RichNote note={event.metadata} />,
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
        header: 'Distributed payouts',
        subject: (
          <span className="font-heading text-lg">
            <NativeTokenValue decimals={8} wei={event.amount.value} />
          </span>
        ),
        extra: (
          <RichNote
            note={`Fee: ${event.fee.value}, Paid out: ${event.amountPaidOut.value}`}
          />
        ),
      }
    case 'distributeReservedTokensEvent':
      return {
        event,
        header: 'Distributed reserved tokens',
        subject: (
          <span className="font-heading text-lg">
            {Number(event.tokenCount)}{' '}
            {tokenSymbolText({ tokenSymbol, plural: event.tokenCount > 1 })}
          </span>
        ),
        extra: null,
      }
    case 'distributeToReservedTokenSplitEvent':
      return {
        event,
        header: 'Distributed to reserved token split',
        subject: (
          <span className="font-heading text-lg">
            {Number(event.tokenCount)}{' '}
            {tokenSymbolText({ tokenSymbol, plural: event.tokenCount > 1 })}
          </span>
        ),
        extra: (
          <RichNote
            note={`Percent: ${event.percent}, Split project: ${event.splitProjectId}`}
          />
        ),
      }
    case 'distributeToPayoutSplitEvent':
      return {
        event,
        header: 'Distributed to payout split',
        subject: (
          <span className="font-heading text-lg">
            <NativeTokenValue decimals={8} wei={event.amount.value} />
          </span>
        ),
        extra: (
          <RichNote
            note={`Percent: ${event.percent}, Split project: ${event.splitProjectId}`}
          />
        ),
      }
    case 'useAllowanceEvent':
      return {
        event,
        header: 'Used allowance',
        subject: (
          <span className="font-heading text-lg">
            <NativeTokenValue decimals={8} wei={event.amount.value} />
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
            note={`Staked: ${event.stakedAmount.value}, ERC20: ${event.erc20Amount.value}`}
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
  { label: 'Distributed payouts', value: 'distributePayoutsEvent' },
  {
    label: 'Distributed reserved tokens',
    value: 'distributeReservedTokensEvent',
  },
  {
    label: 'Distributed to reserved token split',
    value: 'distributeToReservedTokenSplitEvent',
  },
  {
    label: 'Distributed to payout split',
    value: 'distributeToPayoutSplitEvent',
  },
  { label: 'Used allowance', value: 'useAllowanceEvent' },
  { label: 'Burned', value: 'burnEvent' },
]

const useOmnichainSubgraphProjectQuery = ({
  filter,
  sucker,
}: {
  filter?: ProjectEventFilter
  sucker: SuckerPair | undefined
}) => {
  const result = useInfiniteQuery({
    queryKey: ['projectEvents', sucker?.projectId, sucker?.peerChainId, filter],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      if (!sucker) return { data: { projectEvents: [] }, nextCursor: undefined }
      const uri = v4SubgraphUri(sucker.peerChainId)
      const document = ProjectEventsDocument

      const data = await request(uri, document, {
        orderBy: ProjectEvent_OrderBy.timestamp,
        orderDirection: OrderDirection.desc,
        where: {
          projectId: Number(sucker.projectId),
          // ProjectEvents have exactly one non-null Event field. We can use `<filter>_not: null` to return only projectEvents where the matching Event field is defined
          ...(!filter || filter === 'all'
            ? {}
            : {
                [filter + '_not']: null,
              }),
        },
        skip: pageParam * PAGE_SIZE,
        first: PAGE_SIZE,
      })
      const mightHaveNextPage = data.projectEvents.length === PAGE_SIZE
      return {
        data,
        nextCursor: mightHaveNextPage ? pageParam + PAGE_SIZE : undefined,
      }
    },
    getNextPageParam: lastPage => {
      return lastPage.nextCursor
    },
  })

  return result
}

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
