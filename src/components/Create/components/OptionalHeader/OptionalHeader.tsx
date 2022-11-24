import { Trans } from '@lingui/macro'

export const OptionalHeader = ({ header }: { header: string }) => {
  return (
    <>
      {header}{' '}
      <span className="font-light">
        (<Trans>Optional</Trans>)
      </span>
    </>
  )
}
