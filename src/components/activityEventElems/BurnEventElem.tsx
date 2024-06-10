import { t, Trans } from '@lingui/macro'
import { TokenAmount } from 'components/TokenAmount'
import { ProjectEventsQuery } from 'generated/graphql'
import { toBigNumber } from 'utils/bigNumbers'
import { ActivityEvent } from './ActivityElement/ActivityElement'

export default function BurnEventElem({
  event,
  tokenSymbol,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['burnEvent']
  tokenSymbol: string | undefined
  withProjectLink?: boolean
}) {
  if (!event) return null

  const amount = toBigNumber(event.amount)

  return (
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      header={t`Burned`}
      subject={
        <span className="font-heading text-lg font-medium">
          {amount ? (
            <TokenAmount amountWad={amount} tokenSymbol={tokenSymbol} />
          ) : (
            <Trans>Unknown</Trans>
          )}
        </span>
      }
    />
  )
}
