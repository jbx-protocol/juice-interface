import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import FormItemWarningText from 'components/FormItemWarningText'

export default function TokenMintingExtra({
  showMintingWarning,
}: {
  showMintingWarning: boolean
}) {
  return (
    <Space direction="vertical">
      <Trans>
        When enabled, the project owner can manually mint any amount of tokens
        to any address.
      </Trans>
      {showMintingWarning && (
        <FormItemWarningText>
          <Trans>
            Enabling token minting will appear risky to contributors.
          </Trans>
        </FormItemWarningText>
      )}
    </Space>
  )
}
