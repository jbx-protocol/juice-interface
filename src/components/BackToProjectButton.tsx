import { LeftOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import Link from 'next/link'

// Links back to project page from a subroute
export function BackToProjectButton({
  projectPageUrl,
}: {
  projectPageUrl: string
}) {
  return (
    <Link href={projectPageUrl}>
      <Button
        href={projectPageUrl}
        type="link"
        icon={<LeftOutlined />}
        size="small"
      >
        <span>
          <Trans>Back to project</Trans>
        </span>
      </Button>
    </Link>
  )
}
