import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export default function StandardSaveButton({ props }: { props?: any }) {
  return (
    <Button type="primary" {...props}>
      <Trans>Save</Trans>
    </Button>
  )
}
