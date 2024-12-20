import Loading from 'components/Loading'
import RichNote from 'components/RichNote/RichNote'
import { NativeTokenValue, useJBContractContext } from 'juice-sdk-react'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import {
  OrderDirection,
  ProjectEvent_OrderBy,
  ProjectEventsDocument,
} from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import React from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { ActivityEvent } from './activityEventElems/ActivityElement'
import { AnyEvent, transformEventData } from './utils/transformEventsData'

export function V4ActivityList() {
  const { projectId } = useJBContractContext()
  const tokenSymbol = useProjectContext().tokenSymbol

  const { data: projectEventsData, isLoading } = useSubgraphQuery({
    document: ProjectEventsDocument,
    variables: {
      orderBy: ProjectEvent_OrderBy.timestamp,
      orderDirection: OrderDirection.desc,
      where: {
        projectId: Number(projectId),
      },
    },
  })

  const projectEvents = React.useMemo(
    () =>
      projectEventsData?.projectEvents
        .map(transformEventData)
        .filter((event): event is AnyEvent => !!event)
        .map(e => translateEventDataToPresenter(e, tokenSymbol)) ?? [],
    [projectEventsData?.projectEvents, tokenSymbol],
  )

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="mb-6 font-heading text-2xl font-medium">Activity</h2>
      </div>
      <div className="flex flex-col gap-3">
        {isLoading && <Loading />}
        {isLoading || (projectEvents && projectEvents.length > 0) ? (
          projectEvents?.map(event => {
            return (
              <div
                className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
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
          })
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
