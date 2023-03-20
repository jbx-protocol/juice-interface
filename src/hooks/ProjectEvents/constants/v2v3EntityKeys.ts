import { ActivityQueryKey } from '../types/eventFilters'

export const CONFIGURE_EVENT_KEY: ActivityQueryKey<'configureEvent'> = {
  entity: 'configureEvent',
  keys: [
    'id',
    'timestamp',
    'txHash',
    'caller',
    'ballot',
    'dataSource',
    'discountRate',
    'duration',
    'mintingAllowed',
    'pausePay',
    'redeemPaused',
    'redemptionRate',
    'reservedRate',
    'weight',
    'shouldHoldFees',
    'terminalMigrationAllowed',
    'controllerMigrationAllowed',
    'setTerminalsAllowed',
    'setControllerAllowed',
    'memo',
  ],
}

export const DISTRIBUTED_PAYOUTS_EVENT_KEY: ActivityQueryKey<'distributePayoutsEvent'> =
  {
    entity: 'distributePayoutsEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'caller',
      'beneficiary',
      'beneficiaryDistributionAmount',
      'distributedAmount',
      'memo',
      'terminal',
    ],
  }

export const DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY: ActivityQueryKey<'distributeReservedTokensEvent'> =
  {
    entity: 'distributeReservedTokensEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'caller',
      'beneficiary',
      'beneficiaryTokenCount',
      'tokenCount',
    ],
  }

export const DEPLOYED_PROJECT_PAYER_EVENT_KEY: ActivityQueryKey<'deployETHERC20ProjectPayerEvent'> =
  {
    entity: 'deployETHERC20ProjectPayerEvent',
    keys: ['id', 'timestamp', 'txHash', 'caller', 'address', 'memo'],
  }

export const SET_FUND_ACCESS_CONSTRAINTS_EVENT_KEY: ActivityQueryKey<'setFundAccessConstraintsEvent'> =
  {
    entity: 'setFundAccessConstraintsEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'caller',
      'distributionLimit',
      'distributionLimitCurrency',
    ],
  }
