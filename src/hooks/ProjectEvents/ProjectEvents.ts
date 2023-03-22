import { PV_V1, PV_V2 } from 'constants/pv'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { SGWhereArg } from 'models/graph'
import { PV } from 'models/pv'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { useMemo } from 'react'
import {
  excludeSharedEventKeys,
  excludeV1EventKeys,
  excludeV2V3Events
} from './constants/excludeEvents'
import { useProjectEventKeys } from './ProjectEventKeys'
import { ProjectEventFilter } from './types/eventFilters'

const DEFAULT_PAGE_SIZE = 10

export type ProjectEventsOpts = {
  pv?: PV[]
  projectId?: number
  from?: string
  eventFilter?: ProjectEventFilter
  pageSize?: number
}

export function useProjectEvents({
  pv,
  projectId,
  from,
  eventFilter,
  pageSize,
}: ProjectEventsOpts) {
  const where: SGWhereArg<'projectEvent'>[] = useMemo(() => {
    const _where: SGWhereArg<'projectEvent'>[] = [
      // We exclude some events that we don't need to show
      ...excludeSharedEventKeys,
    ]

    if (!pv || pv.includes(PV_V1)) _where.push(...excludeV1EventKeys)
    if (!pv || pv.includes(PV_V2)) _where.push(...excludeV2V3Events)

    if (projectId) {
      _where.push({
        key: 'projectId',
        value: projectId,
      })
    }

    if (from) {
      _where.push({
        key: 'from',
        value: from.toLowerCase(),
      })
    }

    let filterKey: keyof ProjectEvent | undefined = undefined

    switch (eventFilter) {
      case 'addToBalance':
        filterKey = 'addToBalanceEvent'
        break
      case 'burn':
        filterKey = 'burnEvent'
        break
      case 'configure':
        filterKey = 'configureEvent'
        break
      case 'deployERC20':
        filterKey = 'deployedERC20Event'
        break
      case 'deployETHERC20ProjectPayer':
        filterKey = 'deployETHERC20ProjectPayerEvent'
        break
      case 'distributePayouts':
        filterKey = 'distributePayoutsEvent'
        break
      case 'distributeTokens':
        filterKey = 'distributeReservedTokensEvent'
        break
      case 'pay':
        filterKey = 'payEvent'
        break
      case 'printReserves':
        filterKey = 'printReservesEvent'
        break
      case 'projectCreate':
        filterKey = 'projectCreateEvent'
        break
      case 'redeem':
        filterKey = 'redeemEvent'
        break
      case 'setFundAccessConstraints':
        filterKey = 'setFundAccessConstraintsEvent'
        break
      case 'tap':
        filterKey = 'tapEvent'
        break
      case 'v1Configure':
        filterKey = 'v1ConfigureEvent'
        break
    }

    if (filterKey) {
      // If we're filtering, we only want project events where the filtered event is not null
      _where.push({
        key: filterKey,
        operator: 'not',
        value: null,
      })
    }

    return _where
  }, [projectId, eventFilter])

  const entityKeys = useProjectEventKeys({ eventFilter })

  return useInfiniteSubgraphQuery({
    pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
    entity: 'projectEvent',
    keys: ['id', ...entityKeys],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where,
  })
}
