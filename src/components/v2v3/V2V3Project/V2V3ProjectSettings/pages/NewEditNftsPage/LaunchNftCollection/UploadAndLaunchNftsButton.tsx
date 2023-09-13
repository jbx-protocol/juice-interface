import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export function UploadAndLaunchNftsButton({
  className,
  onClick,
  loading,
}: {
  className?: string
  onClick?: VoidFunction
  loading: boolean
}) {
  return (
    <Button
      type="primary"
      onClick={onClick}
      loading={loading}
      className={className}
    >
      <Trans>Deploy NFT collection</Trans>
    </Button>
  )
}
