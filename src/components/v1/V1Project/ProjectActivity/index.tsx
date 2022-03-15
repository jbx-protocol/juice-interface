import { Button, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import Loading from 'components/shared/Loading'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import { DeployedERC20Event } from 'models/subgraph-entities/deployed-erc20-event'
import { PayEvent } from 'models/subgraph-entities/pay-event'
import { PrintReservesEvent } from 'models/subgraph-entities/print-reserves-event'
import { ProjectCreateEvent } from 'models/subgraph-entities/project-create-event'
import { RedeemEvent } from 'models/subgraph-entities/redeem-event'
import { TapEvent } from 'models/subgraph-entities/tap-event'
import { useContext, useState } from 'react'

import ActivityTabContent from './ActivityTabContent'
import DeployedERC20EventElem from './items/DeployedERC20EventElem'
import PayEventElem from './items/PayEventElem'
import ProjectCreateEventElem from './items/ProjectCreateEventElem'
import RedeemEventElem from './items/RedeemEventElem'
import ReservesEventElem from './items/ReservesEventElem'
import TapEventElem from './items/TapEventElem'
import DownloadActivityModal from '../modals/DownloadActivityModal'
import SectionHeader from 'components/shared/SectionHeader'

export default function ProjectActivity() {
  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  const { projectId, isPreviewMode } = useContext(V1ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const pageSize = 50

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
    where: projectId
      ? [
          {
            key: 'projectId',
            value: projectId.toNumber(),
          },
          {
            key: 'cv',
            value: 1,
          },
        ]
      : undefined,
  })

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Space direction="horizontal" align="center" size="small">
          <SectionHeader text={t`Activity`} style={{ margin: 0 }} />
          {!isPreviewMode ? (
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => setDownloadModalVisible(true)}
            />
          ) : null}
        </Space>
      </div>

      <ActivityTabContent
        count={
          projectEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0
        }
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isLoadingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      >
        {projectEvents?.pages.map(group =>
          group.map(e => {
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
        )}
      </ActivityTabContent>

      {isLoading || (isFetchingNextPage && <Loading />)}

      <DownloadActivityModal
        visible={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
