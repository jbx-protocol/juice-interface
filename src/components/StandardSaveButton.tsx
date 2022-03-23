import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export default function StandardSaveButton(props?: Object) {
  return (
    <Button type="primary" htmlType="submit" {...props}>
      <Trans>Save</Trans>
    </Button>
  )
}
