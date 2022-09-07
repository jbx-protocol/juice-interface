import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useTwitterAuth } from 'hooks/socialAuth'

const VerifyTwitter = () => {
  const { onOpen } = useTwitterAuth()
  return (
    <div>
      <p>
        <Trans>Verify your project owns the linked Twitter account.</Trans>
      </p>
      <Button type="primary" onClick={onOpen}>
        <Trans>Verify Twitter</Trans>
      </Button>
    </div>
  )
}

export default VerifyTwitter
