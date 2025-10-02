import { ArrowLeftOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'

export const BackButton = (props: ButtonProps) => {
  return (
    <Button size="middle" {...props}>
      <ArrowLeftOutlined /> <Trans>Back</Trans>
    </Button>
  )
}
