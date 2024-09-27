import { Trans } from '@lingui/macro'

export const OptionalHeader = ({ header }: { header: string }) => {
  return (
    <>
      {header}{' '}
      <span>
        (<Trans>Optional</Trans>)
      </span>
    </>
  )
}
