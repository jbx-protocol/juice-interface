import { ArrowRightOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'

export const NextButton = (props: ButtonProps) => {
  return (
    <Button htmlType="submit" type="primary" size="large" {...props}>
      <Trans>Next</Trans> <ArrowRightOutlined />
    </Button>
  )
}
