import { Trans } from '@lingui/macro'

export const OptionalHeader = ({ header }: { header: string }) => {
  return (
    <Trans>
      {header} <span style={{ fontWeight: 'lighter' }}>(Optional)</span>
    </Trans>
  )
}
