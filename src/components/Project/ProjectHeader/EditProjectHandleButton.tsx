import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import Link from 'next/link'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'

export function EditProjectHandleButton() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

  return (
    <Tooltip
      placement="bottom"
      title={t`A project's handle is used in its URL, and allows it to be included in search results on the projects page.`}
    >
      <div>
        <Link
          href={settingsPagePath('handle', {
            projectId,
            handle,
          })}
          legacyBehavior
        >
          <Button type="link" icon={<PencilSquareIcon />}>
            <span>
              <Trans>Add handle</Trans>
            </span>
          </Button>
        </Link>
      </div>
    </Tooltip>
  )
}
