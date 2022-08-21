import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { PayEvent } from 'models/subgraph-entities/vX/pay-event'
import { useCallback, useContext } from 'react'

import V2ProjectHandle from '../v2/shared/V2ProjectHandle'
import { ActivityEvent } from './ActivityElement'

import { primaryContentFontSize } from './styles'

// Maps a project id to an internal map of payment event overrides.
const payEventOverrides = new Map<number, Map<string, string>>([
  [
    10,
    new Map<string, string>([
      ['Minted WikiToken for Page ID', 'WikiToken minted'],
    ]),
  ],
])

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
      >
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { projectId } = useContext(V1ProjectContext)
  const usePayEventOverrides = projectId && payEventOverrides.has(projectId)

  const formatPayEventOverride = useCallback(
    (e: Partial<PayEvent>) => {
      if (!projectId) {
        return e.note
      }

      let override
      payEventOverrides
        .get(projectId)
        ?.forEach((value: string, key: string) => {
          if (e.note?.includes(key)) {
            override = value
            return
          }
        })

      return override ? override : e.note
    },
    [projectId],
  )

  if (!event) return null
  return (
    <ActivityEvent
      header={'Paid'}
      subject={
        <div style={{ fontSize: primaryContentFontSize }}>
          <ETHAmount amount={event.amount} />
        </div>
      }
      extra={
        event.feeFromV2Project ? (
          <Trans>
            Fee from{' '}
            <span>
              <V2ProjectHandle projectId={event.feeFromV2Project} />
            </span>
          </Trans>
        ) : (
          <RichNote
            note={
              (usePayEventOverrides
                ? formatPayEventOverride(event)
                : event.note) ?? ''
            }
            style={{ color: colors.text.secondary }}
          />
        )
      }
      event={event}
    />
  )
}
