import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import AddToBalanceEventElem from 'components/activityEventElems/AddToBalanceEventElem'
import BurnEventElem from 'components/activityEventElems/BurnEventElem'
import DeployedERC20EventElem from 'components/activityEventElems/DeployedERC20EventElem'
import PayEventElem from 'components/activityEventElems/PayEventElem'
import ProjectCreateEventElem from 'components/activityEventElems/ProjectCreateEventElem'
import RedeemEventElem from 'components/activityEventElems/RedeemEventElem'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import Loading from 'components/Loading'
import SectionHeader from 'components/SectionHeader'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { ProjectEventFilter, useProjectEvents } from 'hooks/useProjectEvents'
import { useContext, useMemo, useState } from 'react'

import ReservesEventElem from './eventElems/ReservesEventElem'
import TapEventElem from './eventElems/TapEventElem'
import V1ConfigureEventElem from './eventElems/V1ConfigureEventElem'
import { V1DownloadActivityModal } from './V1DownloadActivityModal'

const PAGE_SIZE = 10

export function V1ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V1ProjectContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<ProjectEventFilter>('all')

  const eventFilterOption = useMemo(
    () => activityOptions().find(o => o.value === eventFilter),
    [eventFilter],
  )

  const { data, fetchMore, loading } = useProjectEvents({
    pv: PV_V1,
    projectId,
    filter: eventFilter,
    first: PAGE_SIZE,
  })

  const projectEvents = data?.projectEvents

  const count = projectEvents?.length || 0

  const list = useMemo(
    () =>
      projectEvents?.map(e => {
        let elem: JSX.Element | undefined = undefined

        if (e.payEvent) {
          elem = <PayEventElem event={e.payEvent} />
        }
        if (e.burnEvent) {
          elem = <BurnEventElem event={e.burnEvent} tokenSymbol={tokenSymbol} />
        }
        if (e.addToBalanceEvent) {
          elem = <AddToBalanceEventElem event={e.addToBalanceEvent} />
        }
        if (e.tapEvent) {
          elem = <TapEventElem event={e.tapEvent} />
        }
        if (e.redeemEvent) {
          elem = <RedeemEventElem event={e.redeemEvent} />
        }
        if (e.printReservesEvent) {
          elem = <ReservesEventElem event={e.printReservesEvent} />
        }
        if (e.projectCreateEvent) {
          elem = <ProjectCreateEventElem event={e.projectCreateEvent} />
        }
        if (e.deployedERC20Event) {
          elem = <DeployedERC20EventElem event={e.deployedERC20Event} />
        }
        if (e.v1ConfigureEvent) {
          elem = <V1ConfigureEventElem event={e.v1ConfigureEvent} />
        }

        if (!elem) return null

        return (
          <div
            className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
            key={e.id}
          >
            {elem}
          </div>
        )
      }),
    [projectEvents, tokenSymbol],
  )

  const listStatus = useMemo(() => {
    if (loading) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (count === 0 && !loading) {
      return (
        <div className="border-t border-smoke-200 pt-5 text-grey-500 dark:border-grey-600 dark:text-grey-300">
          <Trans>No activity yet</Trans>
        </div>
      )
    }

    if (count % PAGE_SIZE === 0) {
      return (
        <div
          className="cursor-pointer text-center text-grey-500 dark:text-grey-300"
          onClick={() =>
            fetchMore({
              variables: {
                skip: count,
              },
            })
          }
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
  }, [loading, fetchMore, count])

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <SectionHeader className="m-0" text={t`Activity`} />
        <Space direction="horizontal" align="center" size="small">
          {count > 0 && (
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => setDownloadModalVisible(true)}
            />
          )}

          <JuiceListbox
            className="w-48"
            options={activityOptions()}
            value={eventFilterOption}
            onChange={v => setEventFilter(v.value)}
          />
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

interface ActivityOption {
  label: string
  value: ProjectEventFilter
}

const activityOptions = (): ActivityOption[] => [
  { label: t`All events`, value: 'all' },
  { label: t`Paid`, value: 'payEvent' },
  { label: t`Redeemed`, value: 'redeemEvent' },
  { label: t`Burned`, value: 'burnEvent' },
  { label: t`Sent payouts`, value: 'tapEvent' },
  { label: t`Sent reserved tokens`, value: 'printReservesEvent' },
  { label: t`Edited cycle`, value: 'v1ConfigureEvent' },
  { label: t`Deployed ERC20`, value: 'deployedERC20Event' },
  { label: t`Created project`, value: 'projectCreateEvent' },
  { label: t`Transferred ETH to project`, value: 'addToBalanceEvent' },
]
