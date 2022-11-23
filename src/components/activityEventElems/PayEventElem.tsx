import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import RichNote from 'components/RichNote'
import { useV2V3TerminalVersion } from 'hooks/V2V3TerminalVersion'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'
import { formatHistoricalDate } from 'utils/format/formatDate'
import V2V3ProjectHandleLink from '../v2v3/shared/V2V3ProjectHandleLink'

export default function PayEventElem({
  event,
}: {
  event:
    | Pick<
        PayEvent,
        | 'amount'
        | 'timestamp'
        | 'beneficiary'
        | 'note'
        | 'id'
        | 'txHash'
        | 'feeFromV2Project'
        | 'terminal'
      >
    | undefined
}) {
  const terminalVersion = useV2V3TerminalVersion(event?.terminal)

  if (!event) return null

  return (
    <div>
      <div className="flex content-between justify-between">
        <div>
          <div className="text-xs text-grey-400 dark:text-slate-200">
            <Trans>Paid</Trans>
          </div>
          <div className="text-base">
            <ETHAmount amount={event.amount} />
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-grey-400 dark:text-slate-200">
            {terminalVersion && (
              <ProjectVersionBadge
                className="p-0"
                transparent
                size="small"
                versionText={'V' + terminalVersion}
              />
            )}{' '}
            {event.timestamp && formatHistoricalDate(event.timestamp * 1000)}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div className="text-xs leading-6 text-grey-400 dark:text-slate-200">
            <FormattedAddress
              className="font-normal"
              address={event.beneficiary}
            />
          </div>
        </div>
      </div>

      {event.feeFromV2Project ? (
        <div className="mt-1">
          <Trans>
            Fee from{' '}
            <span>
              <V2V3ProjectHandleLink projectId={event.feeFromV2Project} />
            </span>
          </Trans>
        </div>
      ) : (
        <div className="mt-1">
          <RichNote
            className="text-grey-900 dark:text-slate-100"
            note={event.note ?? ''}
          />
        </div>
      )}
    </div>
  )
}
