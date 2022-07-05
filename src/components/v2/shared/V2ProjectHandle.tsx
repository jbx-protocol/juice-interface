import { BigNumberish } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ProjectVersionBadge from 'components/ProjectVersionBadge'
import { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { v2ProjectRoute } from 'utils/routes'

export default function V2ProjectHandle({
  projectId,
  handle,
  style,
}: {
  projectId: BigNumberish
  handle: string | null | undefined
  style?: CSSProperties
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Link
        to={v2ProjectRoute({ projectId, handle })}
        style={{ fontWeight: 500, ...style }}
        className="text-primary hover-text-action-primary hover-text-decoration-underline"
      >
        <span style={{ marginRight: '0.5rem' }}>
          {handle ? `@${handle}` : <Trans>Project {projectId}</Trans>}
        </span>
      </Link>
      <ProjectVersionBadge versionText="V2" size="small" />
    </div>
  )
}
