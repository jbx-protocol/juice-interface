import { Ether, JBProjectToken } from 'juice-sdk-core'
import { PayEventsQuery } from 'packages/v4/graphql/client/graphql'
import { PayEvent } from '../models/ActivityEvents'

export function transformPayEventsRes(
  data: PayEventsQuery | undefined,
): PayEvent[] | undefined {
  return data?.payEvents.map(event => {
    return {
      id: event.id,
      amount: new Ether(BigInt(event.amount)),
      amountUSD: event.amountUSD ? new Ether(BigInt(event.amountUSD)) : undefined,
      beneficiary: event.beneficiary,
      beneficiaryTokenCount: new JBProjectToken(
        BigInt(event.beneficiaryTokenCount),
      ),
      timestamp: event.timestamp,
      txHash: event.txHash,
    }
  })
}
