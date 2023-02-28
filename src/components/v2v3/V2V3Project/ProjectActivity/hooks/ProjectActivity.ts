import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { ProjectEvent } from 'generated/graphql'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { SGWhereArg } from 'models/graph'
import { useContext, useMemo } from 'react'

const PAGE_SIZE = 10

export function useProjectActivity({ eventFilter }: { eventFilter?: string }) {
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

  return useInfiniteSubgraphQuery({
    pageSize: PAGE_SIZE,
    entity: 'projectEvent',
    keys: [
      'id',
      {
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
      },
      {
        entity: 'burnEvent',
        keys: ['id', 'timestamp', 'txHash', 'caller', 'holder', 'amount'],
      },
      {
        entity: 'addToBalanceEvent',
        keys: [
          'amount',
          'timestamp',
          'caller',
          'note',
          'id',
          'txHash',
          'terminal',
        ],
      },
      {
        entity: 'deployedERC20Event',
        keys: ['symbol', 'txHash', 'timestamp', 'id', 'caller'],
      },
      {
        entity: 'tapEvent',
        keys: [
          'id',
          'timestamp',
          'txHash',
          'caller',
          'beneficiary',
          'beneficiaryTransferAmount',
          'netTransferAmount',
        ],
      },
      {
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
      },
      {
        entity: 'projectCreateEvent',
        keys: ['id', 'txHash', 'timestamp', 'caller'],
      },
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
      },
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
      },
      {
        entity: 'deployETHERC20ProjectPayerEvent',
        keys: ['id', 'timestamp', 'txHash', 'caller', 'address', 'memo'],
      },
      {
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
      },
    ],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where,
  })
}
