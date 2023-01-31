import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import TooltipIcon from 'components/TooltipIcon'

export function LegacyProjectTokensDescriptionHeading() {
  return (
    <Space size="small">
      <Trans>Your legacy token balance</Trans>
      <TooltipIcon
        tip={
          <Trans>
            Your total token balance for this project's legacy tokens.
          </Trans>
        }
      />
    </Space>
  )
}
