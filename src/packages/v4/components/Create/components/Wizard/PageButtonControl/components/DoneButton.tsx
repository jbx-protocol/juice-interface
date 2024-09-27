import { t } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'
import { ReactNode } from 'react'

export const DoneButton = (props: ButtonProps & { text?: ReactNode }) => {
  return (
    <Button htmlType="submit" type="primary" size="large" {...props}>
      {props.text ?? t`Done`}
    </Button>
  )
}
