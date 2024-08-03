import EthereumAddress from 'components/EthereumAddress'
import EtherscanLink from 'components/EtherscanLink'
import { formatDistance } from 'date-fns'
import { Ether, JBProjectToken } from 'juice-sdk-core'
import { useJBContractContext, useJBTokenContext } from 'juice-sdk-react'
import {
  OrderDirection,
  PayEvent_OrderBy,
  PayEventsDocument,
  PayEventsQuery,
} from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import { Address } from 'viem'

type PayEvent = {
  id: string
  amount: Ether
  beneficiary: Address
  beneficiaryTokenCount?: JBProjectToken
  timestamp: number
  txHash: string
}

function ActivityItem(ev: PayEvent) {
  const { token } = useJBTokenContext()
  if (!token?.data) return null

  const formattedDate = formatDistance(ev.timestamp * 1000, new Date(), {
    addSuffix: true,
  })

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 text-sm">
        <EthereumAddress address={ev.beneficiary} withEnsAvatar />
        <div>
          bought {ev.beneficiaryTokenCount?.format(6)} {token.data.symbol}
        </div>
      </div>
      <div className="text-zinc-500 ml-7 text-xs">
        Paid {ev.amount.format(6)} ETH •{' '}
        <EtherscanLink type="tx" value={ev.txHash}>
          {formattedDate}
        </EtherscanLink>
      </div>
    </div>
  )
}

function transformPayEventsRes(
  data: PayEventsQuery | undefined,
): PayEvent[] | undefined {
  return data?.payEvents.map(event => {
    return {
      id: event.id,
      amount: new Ether(BigInt(event.amount)),
      beneficiary: event.beneficiary,
      beneficiaryTokenCount: new JBProjectToken(
        // BigInt(0)
        BigInt(event.beneficiaryTokenCount),
      ),
      timestamp: event.timestamp,
      txHash: event.txHash,
    }
  })
}

export function ActivityList() {
  const { projectId } = useJBContractContext()
  const { data } = useSubgraphQuery(PayEventsDocument, {
    orderBy: PayEvent_OrderBy.timestamp,
    orderDirection: OrderDirection.desc,
    where: {
      // pv: PV2,
      projectId: Number(projectId),
    },
  })

  const payEvents = transformPayEventsRes(data)

  return (
    <div>
      <div className="mb-3 font-medium">Activity</div>
      <div className="flex flex-col gap-3">
        {payEvents && payEvents.length > 0 ? (
          payEvents?.map(event => {
            return <ActivityItem key={event.id} {...event} />
          })
        ) : (
          <span className="text-zinc-500 text-sm">No activity yet.</span>
        )}
      </div>
    </div>
  )
}
