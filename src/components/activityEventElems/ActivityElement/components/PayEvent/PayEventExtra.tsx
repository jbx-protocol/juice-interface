import { Trans } from '@lingui/macro'
import RichNote from 'components/RichNote'
import V2ProjectHandle from 'components/v2/shared/V2ProjectHandle'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export function PayEventExtra({
  feeFromV2Project,
  note,
}: {
  feeFromV2Project: number | undefined
  note: string | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (feeFromV2Project) {
    return (
      <Trans>
        Fee from{' '}
        <span>
          <V2ProjectHandle projectId={feeFromV2Project} />
        </span>
      </Trans>
    )
  }
  return <RichNote note={note ?? ''} style={{ color: colors.text.secondary }} />
}
