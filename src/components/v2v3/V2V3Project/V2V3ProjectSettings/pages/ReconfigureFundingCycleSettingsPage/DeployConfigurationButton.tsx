import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export function DeployConfigurationButton({
  className,
  onClick,
  disabled,
  loading,
}: {
  className?: string
  onClick: VoidFunction
  disabled?: boolean
  loading: boolean
}) {
  return (
    <Button
      className={className}
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
