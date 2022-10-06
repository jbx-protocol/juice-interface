import { LeftOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import Link from 'next/link'
import { useContext } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

// Links back to project page from a subroute
export function BackToProjectButton() {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  return (
    <Link href={v2v3ProjectRoute({ projectId, handle })}>
      <Button type="link" icon={<LeftOutlined />} size="small">
        <span>
          <Trans>Back to project</Trans>
        </span>
      </Button>
    </Link>
  )
}
