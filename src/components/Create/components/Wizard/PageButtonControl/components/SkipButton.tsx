import { Trans } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'

export const SkipButton = (props: ButtonProps) => {
  return (
    <Button type="link" {...props}>
      <span style={{ textDecoration: 'underline' }}>
        <Trans>Skip</Trans>
      </span>
    </Button>
  )
}
