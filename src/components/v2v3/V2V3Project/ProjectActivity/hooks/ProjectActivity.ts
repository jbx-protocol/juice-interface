import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { SGEntityKey, SGEntityName, SGWhereArg } from 'models/graph'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { useContext, useMemo } from 'react'

const PAGE_SIZE = 10

type ActivityQueryKey<E extends SGEntityName> = {
  entity: E
  keys: SGEntityKey<E>[]
}

const PAY_EVENT_KEY: ActivityQueryKey<'payEvent'> = {
  entity: 'payEvent',
  keys: [
    'amount',
    'timestamp',
    'from',
    'beneficiary',
    'note',
    'id',
    'txHash',
    'feeFromV2Project',
    'terminal',
  ],
}

const CONFIGURE_EVENT_KEY: ActivityQueryKey<'configureEvent'> = {
  entity: 'configureEvent',
  keys: [
    'id',
    'timestamp',
    'txHash',
    'from',
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
    'useDataSourceForPay',
    'useDataSourceForRedeem',
    'memo',
  ],
}

const BURN_EVENT_KEY: ActivityQueryKey<'burnEvent'> = {
  entity: 'burnEvent',
  keys: ['id', 'timestamp', 'txHash', 'from', 'holder', 'amount'],
}

const ADD_TO_BALANCE_EVENT_KEY: ActivityQueryKey<'addToBalanceEvent'> = {
  entity: 'addToBalanceEvent',
  keys: ['amount', 'timestamp', 'from', 'note', 'id', 'txHash', 'terminal'],
}

const DEPLOYED_ERC20_EVENT_KEY: ActivityQueryKey<'deployedERC20Event'> = {
  entity: 'deployedERC20Event',
  keys: ['symbol', 'txHash', 'timestamp', 'id', 'from'],
}

const REDEEM_EVENT_KEY: ActivityQueryKey<'redeemEvent'> = {
  entity: 'redeemEvent',
  keys: [
    'id',
    'from',
    'amount',
    'beneficiary',
    'txHash',
    'timestamp',
    'returnAmount',
    'terminal',
    'metadata',
    'memo',
  ],
}

const PROJECT_CREATE_EVENT_KEY: ActivityQueryKey<'projectCreateEvent'> = {
  entity: 'projectCreateEvent',
  keys: ['id', 'txHash', 'timestamp', 'from'],
}

const DISTRIBUTED_PAYOUTS_EVENT_KEY: ActivityQueryKey<'distributePayoutsEvent'> =
  {
    entity: 'distributePayoutsEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'from',
      'beneficiary',
      'beneficiaryDistributionAmount',
      'distributedAmount',
      'memo',
      'terminal',
    ],
  }

const DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY: ActivityQueryKey<'distributeReservedTokensEvent'> =
  {
    entity: 'distributeReservedTokensEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'from',
      'beneficiary',
      'beneficiaryTokenCount',
      'tokenCount',
    ],
  }

const DEPLOYED_PROJECT_PAYER_EVENT_KEY: ActivityQueryKey<'deployETHERC20ProjectPayerEvent'> =
  {
    entity: 'deployETHERC20ProjectPayerEvent',
    keys: ['id', 'timestamp', 'txHash', 'from', 'address', 'memo'],
  }

const SET_FUND_ACCESS_CONSTRAINTS_EVENT_KEY: ActivityQueryKey<'setFundAccessConstraintsEvent'> =
  {
    entity: 'setFundAccessConstraintsEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'from',
      'distributionLimit',
      'distributionLimitCurrency',
    ],
  }

export type EventFilter =
  | 'all'
  | 'pay'
  | 'burn'
  | 'addToBalance'
  | 'mintTokens'
  | 'redeem'
  | 'deployERC20'
  | 'projectCreate'
  | 'distributePayouts'
  | 'distributeTokens'
  | 'distributeReservedTokens'
  | 'deployETHERC20ProjectPayer'
  | 'configure'
  | 'setFundAccessConstraints'

export function useProjectActivity({
  eventFilter,
}: {
  eventFilter?: EventFilter
}) {
  const { projectId } = useContext(ProjectMetadataContext)

  const where: SGWhereArg<'projectEvent'>[] = useMemo(() => {
    const _where: SGWhereArg<'projectEvent'>[] = [
      {
        key: 'mintTokensEvent',
        value: null, // Exclude all mintTokensEvents. One of these events is created for every Pay event, and showing both event types may lead to confusion
      },
      {
        key: 'useAllowanceEvent',
        value: null, // Exclude all useAllowanceEvents, no UI support yet
      },
      {
        key: 'distributeToPayoutSplitEvent',
        value: null, // Exclude all distributeToPayoutSplitEvent, no UI support
      },
      {
        key: 'distributeToReservedTokenSplitEvent',
        value: null, // Exclude all distributeToReservedTokenSplitEvent, no UI support
      },
      {
        key: 'initEvent',
        value: null, // Exclude all initEvents, no UI support
      },
      {
        key: 'pv',
        value: PV_V2,
      },
    ]

    if (projectId) {
      _where.push({
        key: 'projectId',
        value: projectId,
      })
    }

    let key: keyof ProjectEvent | undefined = undefined

    switch (eventFilter) {
      case 'deployERC20':
        key = 'deployedERC20Event'
        break
      case 'pay':
        key = 'payEvent'
        break
      case 'burn':
        key = 'burnEvent'
        break
      case 'addToBalance':
        key = 'addToBalanceEvent'
        break
      case 'projectCreate':
        key = 'projectCreateEvent'
        break
      case 'redeem':
        key = 'redeemEvent'
        break
      case 'distributePayouts':
        key = 'distributePayoutsEvent'
        break
      case 'distributeTokens':
        key = 'distributeReservedTokensEvent'
        break
      case 'deployETHERC20ProjectPayer':
        key = 'deployETHERC20ProjectPayerEvent'
        break
      case 'configure':
        key = 'configureEvent'
        break
      case 'setFundAccessConstraints':
        key = 'setFundAccessConstraintsEvent'
        break
    }

    if (key) {
      _where.push({
        key,
        operator: 'not',
        value: null,
      })
    }

    return _where
  }, [projectId, eventFilter])

  const keys = useMemo(() => {
    let key = undefined

    switch (eventFilter) {
      case 'deployERC20':
        key = DEPLOYED_ERC20_EVENT_KEY
        break
      case 'pay':
        key = PAY_EVENT_KEY
        break
      case 'burn':
        key = BURN_EVENT_KEY
        break
      case 'addToBalance':
        key = ADD_TO_BALANCE_EVENT_KEY
        break
      case 'projectCreate':
        key = PROJECT_CREATE_EVENT_KEY
        break
      case 'redeem':
        key = REDEEM_EVENT_KEY
        break
      case 'distributePayouts':
        key = DISTRIBUTED_PAYOUTS_EVENT_KEY
        break
      case 'distributeTokens':
        key = DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY
        break
      case 'deployETHERC20ProjectPayer':
        key = DEPLOYED_PROJECT_PAYER_EVENT_KEY
        break
      case 'configure':
        key = CONFIGURE_EVENT_KEY
        break
      case 'setFundAccessConstraints':
        key = SET_FUND_ACCESS_CONSTRAINTS_EVENT_KEY
        break
    }

    if (key) return [key]

    // if no filter, fetch all
    return [
      DEPLOYED_ERC20_EVENT_KEY,
      PAY_EVENT_KEY,
      BURN_EVENT_KEY,
      ADD_TO_BALANCE_EVENT_KEY,
      PROJECT_CREATE_EVENT_KEY,
      REDEEM_EVENT_KEY,
      DISTRIBUTED_PAYOUTS_EVENT_KEY,
      DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY,
      DEPLOYED_PROJECT_PAYER_EVENT_KEY,
      CONFIGURE_EVENT_KEY,
      SET_FUND_ACCESS_CONSTRAINTS_EVENT_KEY,
    ]
  }, [eventFilter])

  return useInfiniteSubgraphQuery({
    pageSize: PAGE_SIZE,
    entity: 'projectEvent',
    keys: ['id', ...keys],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where,
  })
}
