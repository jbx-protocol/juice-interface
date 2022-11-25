import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Space } from 'antd'
import AddToBalanceEventElem from 'components/activityEventElems/AddToBalanceEventElem'
import DeployedERC20EventElem from 'components/activityEventElems/DeployedERC20EventElem'
import PayEventElem from 'components/activityEventElems/PayEventElem'
import ProjectCreateEventElem from 'components/activityEventElems/ProjectCreateEventElem'
import RedeemEventElem from 'components/activityEventElems/RedeemEventElem'
import Loading from 'components/Loading'
import SectionHeader from 'components/SectionHeader'
import { PV_V1, PV_V1_1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { PrintReservesEvent } from 'models/subgraph-entities/v1/print-reserves-event'
import { TapEvent } from 'models/subgraph-entities/v1/tap-event'
import { V1ConfigureEvent } from 'models/subgraph-entities/v1/v1-configure'
import { AddToBalanceEvent } from 'models/subgraph-entities/vX/add-to-balance-event'
import { DeployedERC20Event } from 'models/subgraph-entities/vX/deployed-erc20-event'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'
import { ProjectCreateEvent } from 'models/subgraph-entities/vX/project-create-event'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { RedeemEvent } from 'models/subgraph-entities/vX/redeem-event'
import { useContext, useMemo, useState } from 'react'
import { WhereConfig } from 'utils/graph'

import ReservesEventElem from './eventElems/ReservesEventElem'
import TapEventElem from './eventElems/TapEventElem'
import V1ConfigureEventElem from './eventElems/V1ConfigureEventElem'
import { V1DownloadActivityModal } from './V1DownloadActivityModal'

type EventFilter =
  | 'all'
  | 'pay'
  | 'addToBalance'
  | 'redeem'
  | 'withdraw'
  | 'printReserves'
  | 'deployERC20'
  | 'projectCreate'
  | 'configure'
// | 'mintTokens' TODO

const pageSize = 50

export default function ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<EventFilter>('all')

  const where: WhereConfig<'projectEvent'>[] = useMemo(() => {
    const _where: WhereConfig<'projectEvent'>[] = [
      {
        key: 'pv',
        operator: 'in',
        value: [PV_V1, PV_V1_1],
      },
      {
        key: 'mintTokensEvent',
        value: null, // Exclude all mintTokensEvents. One of these events is created for every Pay event, and showing both event types may lead to confusion
      },
      {
        key: 'useAllowanceEvent',
        value: null, // Exclude all useAllowanceEvents, no UI support yet
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
      case 'addToBalance':
        key = 'addToBalanceEvent'
        break
      case 'printReserves':
        key = 'printReservesEvent'
        break
      case 'projectCreate':
        key = 'projectCreateEvent'
        break
      case 'redeem':
        key = 'redeemEvent'
        break
      case 'withdraw':
        key = 'tapEvent'
        break
      case 'configure':
        key = 'v1ConfigureEvent'
        break
      // TODO
      // case 'mintTokens':
      //   key = 'mintTokensEvent'
      //   break
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

  const {
    data: projectEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSubgraphQuery({
    pageSize,
    entity: 'projectEvent',
    keys: [
      'id',
      {
        entity: 'payEvent',
        keys: ['amount', 'timestamp', 'beneficiary', 'note', 'id', 'txHash'],
      },
      {
        entity: 'addToBalanceEvent',
        keys: ['amount', 'timestamp', 'caller', 'id', 'txHash'],
      },
      {
        entity: 'deployedERC20Event',
        keys: ['symbol', 'txHash', 'timestamp', 'id'],
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
        entity: 'printReservesEvent',
        keys: [
          'id',
          'timestamp',
          'txHash',
          'caller',
          'beneficiary',
          'beneficiaryTicketAmount',
          'count',
        ],
      },
      {
        entity: 'redeemEvent',
        keys: [
          'id',
          'amount',
          'beneficiary',
          'txHash',
          'timestamp',
          'returnAmount',
        ],
      },
      {
        entity: 'projectCreateEvent',
        keys: ['id', 'txHash', 'timestamp', 'caller'],
      },
      {
        entity: 'v1ConfigureEvent',
        keys: [
          'id',
          'timestamp',
          'txHash',
          'caller',
          'ballot',
          'discountRate',
          'duration',
          'target',
          'bondingCurveRate',
          'reservedRate',
          'currency',
        ],
      },
    ],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where,
  })

  const count =
    projectEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0

  const list = useMemo(
    () =>
      projectEvents?.pages.map(group =>
        group.map((e: ProjectEvent) => {
          let elem: JSX.Element | undefined = undefined

          if (e.payEvent) {
            elem = <PayEventElem event={e.payEvent as PayEvent} />
          }
          if (e.addToBalanceEvent) {
            elem = (
              <AddToBalanceEventElem
                event={e.addToBalanceEvent as AddToBalanceEvent}
              />
            )
          }
          if (e.tapEvent) {
            elem = <TapEventElem event={e.tapEvent as TapEvent} />
          }
          if (e.redeemEvent) {
            elem = <RedeemEventElem event={e.redeemEvent as RedeemEvent} />
          }
          if (e.printReservesEvent) {
            elem = (
              <ReservesEventElem
                event={e.printReservesEvent as PrintReservesEvent}
              />
            )
          }
          if (e.projectCreateEvent) {
            elem = (
              <ProjectCreateEventElem
                event={e.projectCreateEvent as ProjectCreateEvent}
              />
            )
          }
          if (e.deployedERC20Event) {
            elem = (
              <DeployedERC20EventElem
                event={e.deployedERC20Event as DeployedERC20Event}
              />
            )
          }
          if (e.v1ConfigureEvent) {
            elem = (
              <V1ConfigureEventElem
                event={e.v1ConfigureEvent as V1ConfigureEvent}
              />
            )
          }

          if (!elem) return null

          return (
            <div
              className="mb-5 border-x-0 border-t-0 border-b border-solid border-smoke-200 pb-5 dark:border-grey-600"
              key={e.id}
            >
              {elem}
            </div>
          )
        }),
      ),
    [projectEvents],
  )

  const listStatus = useMemo(() => {
    if (isLoading || isFetchingNextPage) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (count === 0 && !isLoading) {
      return (
        <div className="border-x-0 border-b-0 border-t border-solid border-smoke-200 pt-5 text-grey-500 dark:border-grey-600 dark:text-grey-300">
          <Trans>No activity yet</Trans>
        </div>
      )
    }

    if (hasNextPage) {
      return (
        <div
          className="cursor-pointer text-center text-grey-500 dark:text-grey-300"
          onClick={() => fetchNextPage()}
        >
          <Trans>Load more</Trans>
        </div>
      )
    }

    return (
      <div className="p-2 text-center text-grey-500 dark:text-grey-300">
        <Trans>{count} total</Trans>
      </div>
    )
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, count])

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <SectionHeader className="m-0" text={t`Activity`} />

        <Space direction="horizontal" align="center" size="small">
          {count > 0 && (
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => setDownloadModalVisible(true)}
            />
          )}

          <Select
            className="small w-48"
            value={eventFilter}
            onChange={val => setEventFilter(val)}
          >
            <Select.Option value="all">
              <Trans>All events</Trans>
            </Select.Option>
            <Select.Option value="pay">
              <Trans>Paid</Trans>
            </Select.Option>
            {/* TODO */}
            {/* <Select.Option value="mintTokens">
              <Trans>Minted Tokens</Trans>
            </Select.Option> */}
            <Select.Option value="redeem">
              <Trans>Redeemed</Trans>
            </Select.Option>
            <Select.Option value="withdraw">
              <Trans>Distributed funds</Trans>
            </Select.Option>
            <Select.Option value="printReserves">
              <Trans>Distributed reserves</Trans>
            </Select.Option>
            <Select.Option value="configure">
              <Trans>Configured FC</Trans>
            </Select.Option>
            <Select.Option value="deployERC20">
              <Trans>ERC20 Deployed</Trans>
            </Select.Option>
            <Select.Option value="projectCreate">
              <Trans>Project created</Trans>
            </Select.Option>
            <Select.Option value="addToBalance">
              <Trans>Added to balance</Trans>
            </Select.Option>
          </Select>
        </Space>
      </div>

      {list}

      {listStatus}

      <V1DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
