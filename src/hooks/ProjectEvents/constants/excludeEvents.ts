import { SGWhereArg } from 'models/graph'

export const excludeSharedEventKeys: SGWhereArg<'projectEvent'>[] = [
  {
    key: 'mintTokensEvent',
    value: null, // One of these events is created for every Pay event, and showing both event types may lead to confusion
  },
  {
    key: 'useAllowanceEvent',
    value: null,
  },
]

export const excludeV1EventKeys: SGWhereArg<'projectEvent'>[] = [
  {
    key: 'distributeToTicketModEvent',
    value: null,
  },
  {
    key: 'distributeToPayoutModEvent',
    value: null,
  },
  {
    key: 'v1InitEvent',
    value: null,
  },
]

export const excludeV2V3Events: SGWhereArg<'projectEvent'>[] = [
  {
    key: 'distributeToPayoutSplitEvent',
    value: null,
  },
  {
    key: 'distributeToReservedTokenSplitEvent',
    value: null,
  },
  {
    key: 'initEvent',
    value: null,
  },
]
