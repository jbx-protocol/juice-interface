import { t } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'

export const DoneButton = (props: ButtonProps & { text?: string }) => {
  return (
    <Button htmlType="submit" type="primary" size="large" {...props}>
      {props.text ?? t`Done`}
    </Button>
  )
}
