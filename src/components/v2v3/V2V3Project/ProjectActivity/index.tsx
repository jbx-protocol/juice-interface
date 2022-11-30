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
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { DeployETHERC20ProjectPayerEvent } from 'models/subgraph-entities/v2/deploy-eth-erc20-project-payer-event'
import { DistributePayoutsEvent } from 'models/subgraph-entities/v2/distribute-payouts-event'
import { DistributeReservedTokensEvent } from 'models/subgraph-entities/v2/distribute-reserved-tokens-event'
import { AddToBalanceEvent } from 'models/subgraph-entities/vX/add-to-balance-event'
import { DeployedERC20Event } from 'models/subgraph-entities/vX/deployed-erc20-event'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'
import { ProjectCreateEvent } from 'models/subgraph-entities/vX/project-create-event'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { RedeemEvent } from 'models/subgraph-entities/vX/redeem-event'
import { useContext, useMemo, useState } from 'react'
import { WhereConfig } from 'utils/graph'

import V2V3DownloadActivityModal from '../modals/V2V3DownloadActivityModal'
import DeployETHERC20ProjectPayerEventElem from './eventElems/DeployETHERC20ProjectPayerEventElem'
import DistributePayoutsElem from './eventElems/DistributePayoutsElem'
import DistributeReservedTokensEventElem from './eventElems/DistributeReservedTokensElem'

type EventFilter =
  | 'all'
  | 'pay'
  | 'addToBalance'
  | 'mintTokens'
  | 'redeem'
  | 'deployERC20'
  | 'projectCreate'
  | 'distributePayouts'
  | 'distributeTokens'
  | 'distributeReservedTokens'
  | 'deployETHERC20ProjectPayer'
// TODO | 'useAllowanceEvent'

const pageSize = 50

export default function ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<EventFilter>('all')

  const where: WhereConfig<'projectEvent'>[] = useMemo(() => {
    const _where: WhereConfig<'projectEvent'>[] = [
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
        keys: [
          'amount',
          'timestamp',
          'beneficiary',
          'note',
          'id',
          'txHash',
          'feeFromV2Project',
          'terminal',
        ],
      },
      {
        entity: 'addToBalanceEvent',
        keys: ['amount', 'timestamp', 'caller', 'note', 'id', 'txHash'],
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
        entity: 'redeemEvent',
        keys: [
          'id',
          'amount',
          'beneficiary',
          'txHash',
          'timestamp',
          'returnAmount',
          'terminal',
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
          if (e.redeemEvent) {
            elem = <RedeemEventElem event={e.redeemEvent as RedeemEvent} />
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
          if (e.distributePayoutsEvent) {
            elem = (
              <DistributePayoutsElem
                event={e.distributePayoutsEvent as DistributePayoutsEvent}
              />
            )
          }
          if (e.distributeReservedTokensEvent) {
            elem = (
              <DistributeReservedTokensEventElem
                event={
                  e.distributeReservedTokensEvent as DistributeReservedTokensEvent
                }
              />
            )
          }
          if (e.deployETHERC20ProjectPayerEvent) {
            elem = (
              <DeployETHERC20ProjectPayerEventElem
                event={
                  e.deployETHERC20ProjectPayerEvent as DeployETHERC20ProjectPayerEvent
                }
              />
            )
          }
          if (e.useAllowanceEvent) {
            // TODO
            // elem = (
            //   <DeployedERC20EventElem
            //     event={e.deployedERC20Event as DeployedERC20Event}
            //   />
            // )
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
        <div className="border-x-0 border-b-0 border-t border-solid border-smoke-200 pb-5 text-grey-500 dark:border-grey-600 dark:text-grey-300">
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
            className="small w-[200px]"
            value={eventFilter}
            onChange={val => setEventFilter(val)}
          >
            <Select.Option value="all">
              <Trans>All events</Trans>
            </Select.Option>
            <Select.Option value="pay">
              <Trans>Paid</Trans>
            </Select.Option>
            <Select.Option value="addToBalance">
              <Trans>Added to balance</Trans>
            </Select.Option>
            <Select.Option value="redeem">
              <Trans>Redeemed</Trans>
            </Select.Option>
            <Select.Option value="distributePayouts">
              <Trans>Distributed funds</Trans>
            </Select.Option>
            <Select.Option value="distributeTokens">
              <Trans>Distributed tokens</Trans>
            </Select.Option>
            {/* TODO */}
            {/* <Select.Option value="useAllowance">
              <Trans>Used Allowance</Trans>
            </Select.Option> */}
            <Select.Option value="deployERC20">
              <Trans>ERC20 deployed</Trans>
            </Select.Option>
            <Select.Option value="deployETHERC20ProjectPayer">
              <Trans>Payment Address created</Trans>
            </Select.Option>
            <Select.Option value="projectCreate">
              <Trans>Project created</Trans>
            </Select.Option>
          </Select>
        </Space>
      </div>

      {list}

      {listStatus}

      <V2V3DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
