import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ProjectLogo from 'components/ProjectLogo'

export function RevnetBadge({
  projectId,
  logoUri,
  projectName,
}: {
  projectId?: number
  logoUri?: string
  projectName?: string
}) {
  return (
    <Tooltip
      placement="bottom"
      title={
        <Trans>This project is a Revnet</Trans>
      }
    >
      <span className="flex">
        <ProjectLogo
          className="h-4 w-4 rounded-full text-xs"
          projectId={projectId}
          uri={logoUri}
          name={projectName}
          fallback="🧃"
        />
      </span>
    </Tooltip>
  )
}
