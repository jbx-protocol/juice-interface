import { Trans } from '@lingui/macro'

export const OptionalHeader = ({ header }: { header: string }) => {
  return (
    <>
      {header}{' '}
      <span style={{ fontWeight: 'lighter' }}>
        (<Trans>Optional</Trans>)
      </span>
    </>
  )
}
