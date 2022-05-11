import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Space } from 'antd'
import DeployedERC20EventElem from 'components/shared/activityEventElems/DeployedERC20EventElem'
import PayEventElem from 'components/shared/activityEventElems/PayEventElem'
import ProjectCreateEventElem from 'components/shared/activityEventElems/ProjectCreateEventElem'
import RedeemEventElem from 'components/shared/activityEventElems/RedeemEventElem'
import Loading from 'components/shared/Loading'
import V1DownloadActivityModal from 'components/v1/V1DownloadActivityModal'
import SectionHeader from 'components/shared/SectionHeader'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { PrintReservesEvent } from 'models/subgraph-entities/v1/print-reserves-event'
import { TapEvent } from 'models/subgraph-entities/v1/tap-event'
import { DeployedERC20Event } from 'models/subgraph-entities/vX/deployed-erc20-event'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'
import { ProjectCreateEvent } from 'models/subgraph-entities/vX/project-create-event'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { RedeemEvent } from 'models/subgraph-entities/vX/redeem-event'
import { useContext, useMemo, useState } from 'react'
import { WhereConfig } from 'utils/graph'

import ReservesEventElem from './eventElems/ReservesEventElem'
import TapEventElem from './eventElems/TapEventElem'

type EventFilter =
  | 'all'
  | 'pay'
  | 'redeem'
  | 'withdraw'
  | 'printReserves'
  | 'deployERC20'
  | 'projectCreate'
// | 'mintTokens' TODO

export default function ProjectActivity() {
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  const { projectId } = useContext(V1ProjectContext)

  const [eventFilter, setEventFilter] = useState<EventFilter>('all')
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const pageSize = 50

  const where: WhereConfig<'projectEvent'>[] = useMemo(() => {
    const _where: WhereConfig<'projectEvent'>[] = [
      {
        key: 'cv',
        operator: 'in',
        value: ['1', '1.1'],
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
    ],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where,
  })

  const list = useMemo(
    () =>
      projectEvents?.pages.map(group =>
        group.map((e: ProjectEvent) => {
          let elem: JSX.Element | undefined = undefined

          if (e.payEvent) {
            elem = <PayEventElem event={e.payEvent as PayEvent} />
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

          if (!elem) return null

          return (
            <div
              key={e.id}
              style={{
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: '1px solid ' + colors.stroke.tertiary,
              }}
            >
              {elem}
            </div>
          )
        }),
      ),
    [colors, projectEvents],
  )

  const listStatus = useMemo(() => {
    const count =
      projectEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0

    if (isLoading || isFetchingNextPage) {
      return (
        <div>
          <Loading />
        </div>
      )
    } else if (count === 0 && !isLoading) {
      return (
        <div
          style={{
            color: colors.text.secondary,
            paddingTop: 20,
            borderTop: '1px solid ' + colors.stroke.tertiary,
          }}
        >
          <Trans>No activity yet</Trans>
        </div>
      )
    } else if (hasNextPage) {
      return (
        <div
          style={{
            textAlign: 'center',
            color: colors.text.secondary,
            cursor: 'pointer',
          }}
          onClick={() => fetchNextPage()}
        >
          <Trans>Load more</Trans>
        </div>
      )
    } else {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: 10,
            color: colors.text.secondary,
          }}
        >
          <Trans>{count} total</Trans>
        </div>
      )
    }
  }, [
    projectEvents,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    colors,
  ])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <SectionHeader text={t`Activity`} style={{ margin: 0 }} />

        <Space direction="horizontal" align="center" size="small">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => setDownloadModalVisible(true)}
          />

          <Select
            className="small"
            style={{
              width: 200,
            }}
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
              <Trans>Distributed Funds</Trans>
            </Select.Option>
            <Select.Option value="printReserves">
              <Trans>Distributed Reserves</Trans>
            </Select.Option>
            <Select.Option value="deployERC20">
              <Trans>ERC20 Deployed</Trans>
            </Select.Option>
            <Select.Option value="projectCreate">
              <Trans>Project Created</Trans>
            </Select.Option>
          </Select>
        </Space>
      </div>

      {list}

      {listStatus}

      <V1DownloadActivityModal
        visible={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
