import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { scrollToTop } from 'utils/windowUtils'

export default function ScrollToTopButton({
  className,
}: {
  className?: string
}) {
  return (
    <Button className={className} type="link" onClick={scrollToTop}>
      <Trans>Back to top</Trans>
    </Button>
  )
}
