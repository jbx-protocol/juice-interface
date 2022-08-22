import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Space } from 'antd'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import Loading from 'components/Loading'
import SectionHeader from 'components/SectionHeader'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { ProjectEvent } from 'models/subgraph-entities/vX/project-event'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { WhereConfig } from 'utils/graph'

import V2DownloadActivityModal from '../modals/V2DownloadActivityModal'

type EventFilter =
  | 'all'
  | 'pay'
  | 'mintTokens'
  | 'redeem'
  | 'deployERC20'
  | 'projectCreate'
  | 'distributePayouts'
  | 'distributeTokens'
  | 'distributeReservedTokens'
  | 'deployETHERC20ProjectPayer'
// TODO | 'useAllowanceEvent'

export default function ProjectActivity() {
  const initialLoad = useRef(true)
  const { asPath } = useRouter()
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<EventFilter>('all')
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { projectId } = useContext(V2ProjectContext)

  const pageSize = 50

  const where: WhereConfig<'projectEvent'>[] = useMemo(() => {
    const _where: WhereConfig<'projectEvent'>[] = [
      {
        key: 'cv',
        value: '2',
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
        ],
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

  // On initial load, will scroll to highlighted element (if any)
  useEffect(() => {
    if (isLoading || !initialLoad.current || asPath.split('#').length < 2)
      return
    const id = asPath.split('#')[1]
    document.getElementById(id)?.scrollIntoView()
    initialLoad.current = false
  }, [asPath, isLoading])

  const count =
    projectEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0

  const list = useMemo(
    () =>
      projectEvents?.pages.flat().map(event => {
        return (
          <ActivityEvent
            event={event}
            key={event.id}
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: '1px solid ' + colors.stroke.tertiary,
            }}
          />
        )
      }),
    [colors.stroke.tertiary, projectEvents?.pages],
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
    }

    if (hasNextPage) {
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
    }

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
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, colors, count])

  return (
    <div style={{ marginTop: '20px' }}>
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
          {count > 0 && (
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => setDownloadModalVisible(true)}
            />
          )}

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

      <V2DownloadActivityModal
        visible={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
