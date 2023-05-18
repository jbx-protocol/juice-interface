import { ProjectEventsQuery } from 'generated/graphql'

import AddToBalanceEventElem from './AddToBalanceEventElem'
import BurnEventElem from './BurnEventElem'
import DeployedERC20EventElem from './DeployedERC20EventElem'
import PayEventElem from './PayEventElem'
import ProjectCreateEventElem from './ProjectCreateEventElem'
import RedeemEventElem from './RedeemEventElem'
import ReservesEventElem from './v1/ReservesEventElem'
import TapEventElem from './v1/TapEventElem'
import V1ConfigureEventElem from './v1/V1ConfigureEventElem'
import ConfigureEventElem from './v2v3/ConfigureEventElem'
import DeployETHERC20ProjectPayerEventElem from './v2v3/DeployETHERC20ProjectPayerEventElem'
import DistributePayoutsElem from './v2v3/DistributePayoutsElem'
import DistributeReservedTokensEventElem from './v2v3/DistributeReservedTokensElem'
import SetFundAccessConstraintsEventElem from './v2v3/SetFundAccessConstraintsEventElem'

/**
 * Returns a formatted element for any project event
 * @param event Project event object
 * @param tokenSymbol Must be defined for projectEvents with a `burnEvent`
 */
export function AnyProjectEvent({
  event,
  tokenSymbol,
}: {
  event: ProjectEventsQuery['projectEvents'][number]
  tokenSymbol: string | undefined
}) {
  if (event.addToBalanceEvent) {
    return <AddToBalanceEventElem event={event.addToBalanceEvent} />
  }
  if (event.burnEvent) {
    return <BurnEventElem event={event.burnEvent} tokenSymbol={tokenSymbol} />
  }
  if (event.configureEvent) {
    return <ConfigureEventElem event={event.configureEvent} />
  }
  if (event.deployedERC20Event) {
    return <DeployedERC20EventElem event={event.deployedERC20Event} />
  }
  if (event.deployETHERC20ProjectPayerEvent) {
    return (
      <DeployETHERC20ProjectPayerEventElem
        event={event.deployETHERC20ProjectPayerEvent}
      />
    )
  }
  if (event.distributePayoutsEvent) {
    return <DistributePayoutsElem event={event.distributePayoutsEvent} />
  }
  if (event.distributeReservedTokensEvent) {
    return (
      <DistributeReservedTokensEventElem
        event={event.distributeReservedTokensEvent}
      />
    )
  }
  if (event.payEvent) {
    return <PayEventElem event={event.payEvent} />
  }
  if (event.printReservesEvent) {
    return <ReservesEventElem event={event.printReservesEvent} />
  }
  if (event.projectCreateEvent) {
    return <ProjectCreateEventElem event={event.projectCreateEvent} />
  }
  if (event.redeemEvent) {
    return <RedeemEventElem event={event.redeemEvent} />
  }
  if (event.setFundAccessConstraintsEvent) {
    return (
      <SetFundAccessConstraintsEventElem
        event={event.setFundAccessConstraintsEvent}
      />
    )
  }
  if (event.tapEvent) {
    return <TapEventElem event={event.tapEvent} />
  }
  if (event.v1ConfigureEvent) {
    return <V1ConfigureEventElem event={event.v1ConfigureEvent} />
  }

  console.error('Unhandled project event element', event)

  return null
}
