import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export default function ShareToTwitterButton({
  message,
  onClick,
  disabled,
  icon,
}: {
  message: string
  onClick?: VoidFunction
  disabled?: boolean
  icon?: JSX.Element
}) {
  async function tweet() {
    if (onClick) onClick()
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      message,
    )}`

    window.open(twitterUrl, '_blank')
  }
  return (
    <Button onClick={tweet} type="default" disabled={disabled}>
      <Trans>Share to Twitter</Trans> {icon}
    </Button>
  )
}
