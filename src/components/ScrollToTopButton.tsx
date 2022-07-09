import { Trans } from '@lingui/macro'
import { Button } from 'antd'

export default function ScrollToTopButton() {
  return (
    <Button
      type="link"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <Trans>Back to top</Trans>
    </Button>
  )
}
