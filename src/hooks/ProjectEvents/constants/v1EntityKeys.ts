import { ActivityQueryKey } from '../types/eventFilters'

export const V1CONFIGURE_EVENT_KEY: ActivityQueryKey<'v1ConfigureEvent'> = {
  entity: 'v1ConfigureEvent',
  keys: [
    'id',
    'timestamp',
    'txHash',
    'from',
    'ballot',
    'discountRate',
    'duration',
    'target',
    'bondingCurveRate',
    'reservedRate',
    'currency',
    'ticketPrintingIsAllowed',
    'payIsPaused',
  ],
}

export const TAP_EVENT_KEY: ActivityQueryKey<'tapEvent'> = {
  entity: 'tapEvent',
  keys: [
    'id',
    'timestamp',
    'txHash',
    'from',
    'beneficiary',
    'beneficiaryTransferAmount',
    'netTransferAmount',
  ],
}

export const PRINT_RESERVES_EVENT_KEY: ActivityQueryKey<'printReservesEvent'> =
  {
    entity: 'printReservesEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'from',
      'beneficiary',
      'beneficiaryTicketAmount',
      'count',
    ],
  }
