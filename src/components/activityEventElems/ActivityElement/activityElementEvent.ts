import { PayEvent } from 'models/subgraph-entities/vX/pay-event'

export type ActivityElementEvent = Pick<PayEvent, 'timestamp' | 'txHash'> & {
  beneficiary?: string
}
