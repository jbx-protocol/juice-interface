import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { SGWhereArg } from 'models/graph'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { useContext, useMemo } from 'react'

const PAGE_SIZE = 10

type ActivityQueryKey = { entity: keyof ProjectEvent; keys: string[] }

const PAY_EVENT_KEY: ActivityQueryKey = {
  entity: 'payEvent',
  keys: [
    'amount',
    'timestamp',
    'caller',
    'beneficiary',
    'note',
    'id',
    'txHash',
    'feeFromV2Project',
    'terminal',
  ],
}

const CONFIGURE_EVENT_KEY: ActivityQueryKey = {
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
    'payPaused',
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

const BURN_EVENT_KEY: ActivityQueryKey = {
  entity: 'burnEvent',
  keys: ['id', 'timestamp', 'txHash', 'caller', 'holder', 'amount'],
}

const ADD_TO_BALANCE_EVENT_KEY: ActivityQueryKey = {
  entity: 'addToBalanceEvent',
  keys: ['amount', 'timestamp', 'caller', 'note', 'id', 'txHash', 'terminal'],
}

const DEPLOYED_ERC20_EVENT_KEY: ActivityQueryKey = {
  entity: 'deployedERC20Event',
  keys: ['symbol', 'txHash', 'timestamp', 'id', 'caller'],
}

const REDEEM_EVENT_KEY: ActivityQueryKey = {
  entity: 'redeemEvent',
  keys: [
    'id',
    'caller',
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

const PROJECT_CREATE_EVENT_KEY: ActivityQueryKey = {
  entity: 'projectCreateEvent',
  keys: ['id', 'txHash', 'timestamp', 'caller'],
}

const DISTRIBUTED_PAYOUTS_EVENT_KEY: ActivityQueryKey = {
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

const DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY: ActivityQueryKey = {
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

const DEPLOYED_PROJECT_PAYER_EVENT_KEY: ActivityQueryKey = {
  entity: 'deployETHERC20ProjectPayerEvent',
  keys: ['id', 'timestamp', 'txHash', 'caller', 'address', 'memo'],
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

  const keys: ActivityQueryKey[] = useMemo(() => {
    let key: ActivityQueryKey | undefined = undefined

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
    }

    if (key) {
      return [key]
    }

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
