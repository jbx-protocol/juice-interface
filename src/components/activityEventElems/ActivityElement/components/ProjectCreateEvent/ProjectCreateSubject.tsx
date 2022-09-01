import { Trans } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'

export function ProjectCreateSubject({
  caller,
}: {
  caller: string | undefined
}) {
  if (caller) {
    return (
      <Trans>
        Project created by <FormattedAddress address={caller} />
      </Trans>
    )
  }
  return <Trans>Project created</Trans>
}
