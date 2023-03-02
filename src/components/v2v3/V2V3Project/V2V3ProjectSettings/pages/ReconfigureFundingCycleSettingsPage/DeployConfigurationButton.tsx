import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export function DeployConfigurationButton({
  onClick,
  disabled,
  loading,
}: {
  onClick: VoidFunction
  disabled?: boolean
  loading: boolean
}) {
  return (
    <Button
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      type="primary"
      size="large"
    >
      <span>
        <Trans>Deploy cycle</Trans>
      </span>
    </Button>
  )
}
