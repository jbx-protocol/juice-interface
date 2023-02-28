import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Space } from 'antd'
import AddToBalanceEventElem from 'components/activityEventElems/AddToBalanceEventElem'
import BurnEventElem from 'components/activityEventElems/BurnEventElem'
import DeployedERC20EventElem from 'components/activityEventElems/DeployedERC20EventElem'
import PayEventElem from 'components/activityEventElems/PayEventElem'
import ProjectCreateEventElem from 'components/activityEventElems/ProjectCreateEventElem'
import RedeemEventElem from 'components/activityEventElems/RedeemEventElem'
import Loading from 'components/Loading'
import SectionHeader from 'components/SectionHeader'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext, useMemo, useState } from 'react'
import V2V3DownloadActivityModal from '../modals/V2V3DownloadActivityModal'
import ConfigureEventElem from './eventElems/ConfigureEventElem'
import DeployETHERC20ProjectPayerEventElem from './eventElems/DeployETHERC20ProjectPayerEventElem'
import DistributePayoutsElem from './eventElems/DistributePayoutsElem'
import DistributeReservedTokensEventElem from './eventElems/DistributeReservedTokensElem'
import { useProjectActivity } from './hooks/ProjectActivity'

type EventFilter =
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

export default function ProjectActivity() {
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<EventFilter>('all')

  const {
    data: projectEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useProjectActivity({ eventFilter })

  const count =
    projectEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0

  const list = useMemo(
    () =>
      projectEvents?.pages.map(group =>
        group.map(e => {
          let elem: JSX.Element | undefined = undefined

          if (e.payEvent) {
            elem = <PayEventElem event={e.payEvent} />
          }
          if (e.burnEvent) {
            elem = (
              <BurnEventElem event={e.burnEvent} tokenSymbol={tokenSymbol} />
            )
          }
          if (e.addToBalanceEvent) {
            elem = <AddToBalanceEventElem event={e.addToBalanceEvent} />
          }
          if (e.redeemEvent) {
            elem = <RedeemEventElem event={e.redeemEvent} />
          }
          if (e.projectCreateEvent) {
            elem = <ProjectCreateEventElem event={e.projectCreateEvent} />
          }
          if (e.deployedERC20Event) {
            elem = <DeployedERC20EventElem event={e.deployedERC20Event} />
          }
          if (e.distributePayoutsEvent) {
            elem = <DistributePayoutsElem event={e.distributePayoutsEvent} />
          }
          if (e.distributeReservedTokensEvent) {
            elem = (
              <DistributeReservedTokensEventElem
                event={e.distributeReservedTokensEvent}
              />
            )
          }
          if (e.deployETHERC20ProjectPayerEvent) {
            elem = (
              <DeployETHERC20ProjectPayerEventElem
                event={e.deployETHERC20ProjectPayerEvent}
              />
            )
          }
          if (e.configureEvent) {
            elem = <ConfigureEventElem event={e.configureEvent} />
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
    [projectEvents, tokenSymbol],
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
            <Select.Option value="redeem">
              <Trans>Redeemed</Trans>
            </Select.Option>
            <Select.Option value="burn">
              <Trans>Burned</Trans>
            </Select.Option>
            <Select.Option value="distributePayouts">
              <Trans>Distributed funds</Trans>
            </Select.Option>
            <Select.Option value="distributeTokens">
              <Trans>Distributed tokens</Trans>
            </Select.Option>
            <Select.Option value="configure">
              <Trans>Configured FC</Trans>
            </Select.Option>
            <Select.Option value="addToBalance">
              <Trans>Added to balance</Trans>
            </Select.Option>
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
