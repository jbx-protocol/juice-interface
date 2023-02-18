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
      className="mt-5"
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      type="primary"
      size="large"
    >
      <span>
        <Trans>Deploy funding cycle configuration</Trans>
      </span>
    </Button>
  )
}
