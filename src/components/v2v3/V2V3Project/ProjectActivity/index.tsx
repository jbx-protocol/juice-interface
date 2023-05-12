import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import AddToBalanceEventElem from 'components/activityEventElems/AddToBalanceEventElem'
import BurnEventElem from 'components/activityEventElems/BurnEventElem'
import DeployedERC20EventElem from 'components/activityEventElems/DeployedERC20EventElem'
import PayEventElem from 'components/activityEventElems/PayEventElem'
import ProjectCreateEventElem from 'components/activityEventElems/ProjectCreateEventElem'
import RedeemEventElem from 'components/activityEventElems/RedeemEventElem'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import Loading from 'components/Loading'
import SectionHeader from 'components/SectionHeader'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { ProjectEventFilter, useProjectEvents } from 'hooks/useProjectEvents'
import { useContext, useMemo, useState } from 'react'

import V2V3DownloadActivityModal from '../modals/V2V3DownloadActivityModal'
import ConfigureEventElem from './eventElems/ConfigureEventElem'
import DeployETHERC20ProjectPayerEventElem from './eventElems/DeployETHERC20ProjectPayerEventElem'
import DistributePayoutsElem from './eventElems/DistributePayoutsElem'
import DistributeReservedTokensEventElem from './eventElems/DistributeReservedTokensElem'
import SetFundAccessConstraintsEventElem from './eventElems/SetFundAccessConstraintsEventElem'

const PAGE_SIZE = 10

export function V2V3ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<ProjectEventFilter>('all')

  const { data, fetchMore, loading } = useProjectEvents({
    pv: PV_V2,
    projectId,
    filter: eventFilter,
    first: PAGE_SIZE,
    skip: 0,
  })

  const projectEvents = data?.projectEvents

  const activityOption = activityOptions().find(o => o.value === eventFilter)

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
        if (e.setFundAccessConstraintsEvent) {
          elem = (
            <SetFundAccessConstraintsEventElem
              event={e.setFundAccessConstraintsEvent}
            />
          )
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
        <>
          <Divider />
          <div className="my-5 pb-5 text-grey-500 dark:text-grey-300">
            <Trans>No activity yet</Trans>
          </div>
        </>
      )
    }

    if (count % PAGE_SIZE === 0) {
      return (
        <div className="text-center">
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  skip: count,
                },
              })
            }
            type="link"
            className="px-0"
          >
            <Trans>Load more</Trans>
          </Button>
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
      <div className="mb-5 flex items-start justify-between">
        <SectionHeader className="m-0" text={t`Activity`} />

        <div className="flex gap-2">
          {count > 0 && (
            <Button
              type="text"
              icon={<ArrowDownTrayIcon className="inline h-5 w-5" />}
              onClick={() => setDownloadModalVisible(true)}
            />
          )}

          <JuiceListbox
            className="w-[200px]"
            options={activityOptions()}
            value={activityOption}
            onChange={v => setEventFilter(v.value)}
          />
        </div>
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

interface ActivityOption {
  label: string
  value: ProjectEventFilter
}

const activityOptions = (): ActivityOption[] => [
  { label: t`All events`, value: 'all' },
  { label: t`Paid`, value: 'payEvent' },
  { label: t`Redeemed`, value: 'redeemEvent' },
  { label: t`Burned`, value: 'burnEvent' },
  { label: t`Sent payouts`, value: 'distributePayoutsEvent' },
  { label: t`Sent reserved tokens`, value: 'distributeReservedTokensEvent' },
  { label: t`Edited cycle`, value: 'configureEvent' },
  { label: t`Edited payout`, value: 'setFundAccessConstraintsEvent' },
  { label: t`Transferred ETH to project`, value: 'addToBalanceEvent' },
  { label: t`Deployed ERC20`, value: 'deployedERC20Event' },
  {
    label: t`Created a project payer address`,
    value: 'deployETHERC20ProjectPayerEvent',
  },
  { label: t`Created project`, value: 'projectCreateEvent' },
]
