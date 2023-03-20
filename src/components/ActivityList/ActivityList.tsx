import { Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import AddToBalanceEventElem from 'components/activityEventElems/AddToBalanceEventElem'
import BurnEventElem from 'components/activityEventElems/BurnEventElem'
import DeployedERC20EventElem from 'components/activityEventElems/DeployedERC20EventElem'
import PayEventElem from 'components/activityEventElems/PayEventElem'
import ProjectCreateEventElem from 'components/activityEventElems/ProjectCreateEventElem'
import RedeemEventElem from 'components/activityEventElems/RedeemEventElem'
import Loading from 'components/Loading'
import ReservesEventElem from 'components/v1/V1Project/ProjectActivity/eventElems/ReservesEventElem'
import TapEventElem from 'components/v1/V1Project/ProjectActivity/eventElems/TapEventElem'
import V1ConfigureEventElem from 'components/v1/V1Project/ProjectActivity/eventElems/V1ConfigureEventElem'
import ConfigureEventElem from 'components/v2v3/V2V3Project/ProjectActivity/eventElems/ConfigureEventElem'
import DeployETHERC20ProjectPayerEventElem from 'components/v2v3/V2V3Project/ProjectActivity/eventElems/DeployETHERC20ProjectPayerEventElem'
import DistributePayoutsElem from 'components/v2v3/V2V3Project/ProjectActivity/eventElems/DistributePayoutsElem'
import DistributeReservedTokensEventElem from 'components/v2v3/V2V3Project/ProjectActivity/eventElems/DistributeReservedTokensElem'
import SetFundAccessConstraintsEventElem from 'components/v2v3/V2V3Project/ProjectActivity/eventElems/SetFundAccessConstraintsEventElem'
import {
  ProjectEventsOpts,
  useProjectEvents
} from 'hooks/ProjectEvents/ProjectEvents'
import { useMemo } from 'react'

export function ActivityList(opts: ProjectEventsOpts) {
  const {
    data: projectEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useProjectEvents(opts)

  const count =
    projectEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0

  const list = useMemo(
    () =>
      projectEvents?.pages.map(group =>
        group.map(e => {
          let elem: JSX.Element | undefined = undefined

          if (e.addToBalanceEvent) {
            elem = <AddToBalanceEventElem event={e.addToBalanceEvent} />
          }
          if (e.burnEvent) {
            elem = <BurnEventElem event={e.burnEvent} />
          }
          if (e.configureEvent) {
            elem = <ConfigureEventElem event={e.configureEvent} />
          }
          if (e.deployedERC20Event) {
            elem = <DeployedERC20EventElem event={e.deployedERC20Event} />
          }
          if (e.deployETHERC20ProjectPayerEvent) {
            elem = (
              <DeployETHERC20ProjectPayerEventElem
                event={e.deployETHERC20ProjectPayerEvent}
              />
            )
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
          if (e.payEvent) {
            elem = <PayEventElem event={e.payEvent} />
          }
          if (e.printReservesEvent) {
            elem = <ReservesEventElem event={e.printReservesEvent} />
          }
          if (e.projectCreateEvent) {
            elem = <ProjectCreateEventElem event={e.projectCreateEvent} />
          }
          if (e.redeemEvent) {
            elem = <RedeemEventElem event={e.redeemEvent} />
          }
          if (e.setFundAccessConstraintsEvent) {
            elem = (
              <SetFundAccessConstraintsEventElem
                event={e.setFundAccessConstraintsEvent}
              />
            )
          }
          if (e.tapEvent) {
            elem = <TapEventElem event={e.tapEvent} />
          }
          if (e.v1ConfigureEvent) {
            elem = <V1ConfigureEventElem event={e.v1ConfigureEvent} />
          }

          if (!elem) {
            console.warn('[ActivityList]: Unhandled event', e)
            return null
          }

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
        <>
          <Divider />
          <div className="my-5 pb-5 text-grey-500 dark:text-grey-300">
            <Trans>No activity yet</Trans>
          </div>
        </>
      )
    }

    if (hasNextPage) {
      return (
        <div className="text-center">
          <Button onClick={() => fetchNextPage()} type="text" className="px-0">
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
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, count])

  return (
    <div>
      {list} {listStatus}
    </div>
  )
}
