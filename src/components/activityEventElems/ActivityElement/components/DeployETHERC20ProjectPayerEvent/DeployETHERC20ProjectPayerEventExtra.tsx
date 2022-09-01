import { Trans } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'

export function DeployETHERC20ProjectPayerEventExtra({
  address,
  memo,
}: {
  address: string | undefined
  memo: string | undefined
}) {
  return (
    <>
      <div>
        <Trans>
          Address: <FormattedAddress address={address} />
        </Trans>
      </div>
      {memo && (
        <div style={{ marginTop: 5 }}>
          <RichNote note={memo} />
        </div>
      )}
    </>
  )
}
