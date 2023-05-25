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
 * @param tokenSymbol Should be defined for projectEvents with a `burnEvent`, otherwise default "tokens" text will be used.
 */
export function AnyProjectEvent({
  event,
  tokenSymbol,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][number]
  tokenSymbol?: string
  withProjectLink?: boolean
}) {
  if (event.addToBalanceEvent) {
    return (
      <AddToBalanceEventElem
        event={event.addToBalanceEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.burnEvent) {
    return (
      <BurnEventElem
        event={event.burnEvent}
        tokenSymbol={
          // TODO tokenSymbol is currently obtained via Context. However the context will vary depending on project version, and will not be present if rendering BurnEventElem outside a project dashboard. We should find another option for cacheing tokenSymbols so the component can do a lookup itself without needing an on-chain call. This will avoid parent components needing to pass down tokenSymbol to this component just to properly render BurnEventElems
          tokenSymbol
        }
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.configureEvent) {
    return (
      <ConfigureEventElem
        event={event.configureEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.deployedERC20Event) {
    return (
      <DeployedERC20EventElem
        event={event.deployedERC20Event}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.deployETHERC20ProjectPayerEvent) {
    return (
      <DeployETHERC20ProjectPayerEventElem
        event={event.deployETHERC20ProjectPayerEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.distributePayoutsEvent) {
    return (
      <DistributePayoutsElem
        event={event.distributePayoutsEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.distributeReservedTokensEvent) {
    return (
      <DistributeReservedTokensEventElem
        event={event.distributeReservedTokensEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.payEvent) {
    return (
      <PayEventElem event={event.payEvent} withProjectLink={withProjectLink} />
    )
  }
  if (event.printReservesEvent) {
    return (
      <ReservesEventElem
        event={event.printReservesEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.projectCreateEvent) {
    return (
      <ProjectCreateEventElem
        event={event.projectCreateEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.redeemEvent) {
    return (
      <RedeemEventElem
        event={event.redeemEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.setFundAccessConstraintsEvent) {
    return (
      <SetFundAccessConstraintsEventElem
        event={event.setFundAccessConstraintsEvent}
        withProjectLink={withProjectLink}
      />
    )
  }
  if (event.tapEvent) {
    return (
      <TapEventElem event={event.tapEvent} withProjectLink={withProjectLink} />
    )
  }
  if (event.v1ConfigureEvent) {
    return (
      <V1ConfigureEventElem
        event={event.v1ConfigureEvent}
        withProjectLink={withProjectLink}
      />
    )
  }

  console.error('AnyProjectEvent: Unhandled project event', event)

  return null
}
