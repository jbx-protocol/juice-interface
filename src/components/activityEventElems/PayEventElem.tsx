import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { useV2V3TerminalVersion } from 'hooks/V2V3TerminalVersion'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'

import V2V3ProjectHandleLink from '../v2v3/shared/V2V3ProjectHandleLink'

import {
  contentLineHeight,
  primaryContentFontSize,
  smallHeaderStyle,
} from './styles'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const terminalVersion = useV2V3TerminalVersion(event?.terminal)

  if (!event) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'space-between',
        }}
      >
        <div>
          <div style={smallHeaderStyle(colors)}>
            <Trans>Paid</Trans>
          </div>
          <div
            style={{
              lineHeight: contentLineHeight,
              fontSize: primaryContentFontSize,
            }}
          >
            <ETHAmount amount={event.amount} />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={smallHeaderStyle(colors)}>
            {terminalVersion && (
              <ProjectVersionBadge
                style={{ padding: 0, background: 'transparent' }}
                versionText={'V' + terminalVersion}
              />
            )}{' '}
            {event.timestamp && formatHistoricalDate(event.timestamp * 1000)}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div
            style={{
              ...smallHeaderStyle(colors),
              lineHeight: contentLineHeight,
            }}
          >
            <FormattedAddress
              address={event.beneficiary}
              style={{ fontWeight: 400 }}
            />
          </div>
        </div>
      </div>

      {event.feeFromV2Project ? (
        <div style={{ marginTop: 5 }}>
          <Trans>
            Fee from{' '}
            <span>
              <V2V3ProjectHandleLink projectId={event.feeFromV2Project} />
            </span>
          </Trans>
        </div>
      ) : (
        <div style={{ marginTop: 5 }}>
          <RichNote
            note={event.note ?? ''}
            style={{ color: colors.text.secondary }}
          />
        </div>
      )}
    </div>
  )
}
